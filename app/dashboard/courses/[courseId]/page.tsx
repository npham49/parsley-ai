import { getCourseAction } from "./actions";
import CourseInformation from "./course-information";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseAction({ courseId: params.courseId });

  if (course?.serverError || !course?.data) {
    return (
      <div>
        <h1>Server Error</h1>
        <p>Sorry, there was a problem loading the course.</p>
      </div>
    );
  }

  return <CourseInformation course={course?.data} />;
}
