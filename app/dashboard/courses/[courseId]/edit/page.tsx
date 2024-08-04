import { getCourseAction } from "../actions";
import CourseEditForm from "./edit-course-form";

export default async function CourseEditPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseAction({ courseId: params.courseId });

  if (!course || course?.serverError || !course?.data) {
    return (
      <div>
        <h1>Server Error</h1>
        <p>Sorry, there was a problem loading the course.</p>
      </div>
    );
  }
  return (
    <div>
      <CourseEditForm course={course.data} />
    </div>
  );
}
