import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { db } from "@/utils/db";
import Navbar from "@/components/Navbar";
import AddDepartment from "@/components/AddDepartment";

// Fetch departments from the database
async function getDepartments() {
  return await db.department.findMany();
}

export default async function AssetsPage() {
  const departments = await getDepartments();

  return (
    <div className="container mx-auto p-8 min-h-dvh">
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <div className="flex flex-row justify-between mt-20 p-3">
        <h1 className="text-3xl font-bold">Select a Department</h1>
        {/* @ts-ignore */}
        <AddDepartment />
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Link href={`/assets/all`} className="no-underline">
          <Card className="hover:shadow-lg hover:bg-neutral-200 transition-shadow m-3 w-[200px] h-[200px]">
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
              <CardDescription>Browse all assets</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {departments.map((dept) => (
          <Link
            href={`/assets/department/${dept.id}`}
            key={dept.id}
            className="no-underline"
          >
            <Card className="hover:shadow-lg hover:bg-neutral-200 transition-shadow m-3 w-[200px] h-[200px]">
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
                <CardDescription>Browse {dept.name} assets</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
