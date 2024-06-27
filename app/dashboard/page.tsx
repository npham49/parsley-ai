import Dashboard from "@/components/Dashboard";
import { getCourses } from "./actions";

export default async function Page() {
  const initialData = await getCourses();

  if (initialData?.serverError || !initialData || !initialData.data) {
    return <div>Something went wrong... {initialData?.serverError}</div>;
  }

  return <Dashboard initialData={initialData?.data} />;
}