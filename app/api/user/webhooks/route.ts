import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import {
  createUser,
  deleteUserByClerkId,
  getUserByClerkId,
  updateUserByClerkId,
} from "@/db/services/user";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console

  // if the event is a user event, then assign the data to tupe UserJSON
  let data: UserJSON | null = null;
  if (evt.type.startsWith("user.")) {
    data = evt.data as UserJSON;
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", data);

  try {
    switch (eventType) {
      case "user.created":
        const user = await getUserByClerkId(data?.id || "");

        if (user) {
          return new Response("User already exists", {
            status: 400,
          });
        }

        // Do something when a user is created
        await createUser({
          email:
            data?.email_addresses.filter(
              (e) => e.id === data?.primary_email_address_id
            )[0].email_address || "",
          name: data?.username || "",
          clerkId: data?.id || "",
        });
        break;
      case "user.updated":
        // Do something when a user is updated
        await updateUserByClerkId(data?.id || "", {
          email:
            data?.email_addresses.filter(
              (e) => e.id === data?.primary_email_address_id
            )[0].email_address || "",
          name: data?.username || "",
        });
        break;
      case "user.deleted":
        // Do something when a user is deleted
        await deleteUserByClerkId(data?.id || "");
        break;
      default:
        // Handle other events
        return new Response("Unhandled event", {
          status: 400,
        });
        break;
    }
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }

  return new Response("Success", { status: 200 });
}
