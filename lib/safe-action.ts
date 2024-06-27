import { auth } from "@clerk/nextjs/server";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";

export const actionClient = createSafeActionClient();

// This client extends the base one and ensures that the user is authenticated before running
// action server code function. Note that by extending the base client, you don't need to
// redeclare the logging middleware, is will simply be inherited by the new client.
export const authActionClient = actionClient
  // In this case, context is used for (fake) auth purposes.
  .use(async ({ next }) => {

    const { userId } = auth();

    if (!userId) {
      redirect("/sign-in");
    }

    // Here we return the context object for the next middleware in the chain/server code function.
    return next({
      ctx: {
        userId,
      },
    });
  });