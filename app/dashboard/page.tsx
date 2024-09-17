"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  MessageSquare,
  Upload,
  Search,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function UserDashboard() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const recentDocuments = [
    {
      id: 1,
      name: "Week 1 Lecture Notes.pdf",
      date: "2 hours ago",
      course: "Introduction to Computer Science",
    },
    {
      id: 2,
      name: "Assignment 2.pdf",
      date: "1 day ago",
      course: "Data Structures and Algorithms",
    },
    {
      id: 3,
      name: "Study Guide.pdf",
      date: "3 days ago",
      course: "Machine Learning Basics",
    },
    {
      id: 4,
      name: "Project Proposal.pdf",
      date: "1 week ago",
      course: "Software Engineering Principles",
    },
  ];

  const recentChats = [
    {
      id: 1,
      title: "Week 1 Concepts Discussion",
      date: "1 hour ago",
      course: "Introduction to Computer Science",
    },
    {
      id: 2,
      title: "Assignment 2 Q&A",
      date: "2 days ago",
      course: "Data Structures and Algorithms",
    },
    {
      id: 3,
      title: "ML Models Clarification",
      date: "4 days ago",
      course: "Machine Learning Basics",
    },
  ];

  const enrolledCourses = [
    { id: 1, name: "Introduction to Computer Science", progress: 30 },
    { id: 2, name: "Data Structures and Algorithms", progress: 65 },
    { id: 3, name: "Machine Learning Basics", progress: 15 },
    { id: 4, name: "Software Engineering Principles", progress: 50 },
  ];

  return (
    <div className="container mx-auto space-y-4 p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.user?.fullName}!
        </h1>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload Course Document
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" /> New Course Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 / 4 Courses</div>
            <progress className="mt-2 w-full" value={50} max={100}></progress>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Recent Course Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="chats">Chats</TabsTrigger>
              </TabsList>
              <TabsContent value="documents">
                <ScrollArea className="h-[200px]">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center py-2">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.course}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="chats">
                <ScrollArea className="h-[200px]">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="flex items-center py-2">
                      <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{chat.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {chat.course}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chat.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Search Course Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your course documents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> New Course Document
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Enrolled Courses</CardTitle>
          <CardDescription>
            Access your course materials and chats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>Progress: {course.progress}%</div>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Go to Course
                      </Button>
                    </Link>
                  </div>
                  <progress
                    className="mt-2 w-full"
                    value={course.progress}
                    max={100}
                  ></progress>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/courses" className="w-full">
            <Button variant="outline" className="w-full">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
