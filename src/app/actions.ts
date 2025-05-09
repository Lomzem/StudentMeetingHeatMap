"use server";

import { db } from "@/db";
import {
  majorTable,
  courseTable,
  weekdayTable,
  occupancyTable,
  sessionTable,
  Major,
  Course,
} from "@/db/schema";
import { eq, getTableColumns, inArray, sql } from "drizzle-orm";

// Get list of majors
export async function getMajors(): Promise<Major[]> {
  return db.select().from(majorTable);
}

export type HeatmapData = {
  weekday: string;
  time: string;
  enrolled: number;
};

// Get heatmap data filtered by selected major abbreviations
export async function getHeatmapDataByMajors(
  majors: Major[],
): Promise<HeatmapData[]> {
  if (majors.length === 0) {
    return [];
  }

  const majorIds = majors.map((m) => m.id);

  return db
    .select({
      weekday: weekdayTable.name,
      time: occupancyTable.time,
      enrolled: sql<number>`cast(sum(${occupancyTable.enrollmentTotal}) as int)`,
    })
    .from(occupancyTable)
    .innerJoin(sessionTable, eq(sessionTable.id, occupancyTable.sessionId))
    .innerJoin(courseTable, eq(courseTable.id, sessionTable.courseId))
    .innerJoin(majorTable, eq(majorTable.id, courseTable.majorId))
    .innerJoin(weekdayTable, eq(weekdayTable.id, occupancyTable.weekdayId))
    .where(inArray(majorTable.id, majorIds))
    .groupBy(occupancyTable.time, weekdayTable.id)
    .orderBy(weekdayTable.id, occupancyTable.time);
}

export async function getCoursesByMajor(majors: Major[]): Promise<Course[]> {
  if (majors.length === 0) {
    return [];
  }

  const majorIds = majors.map((m) => m.id);

  return db
    .select(getTableColumns(courseTable))
    .from(majorTable)
    .innerJoin(courseTable, eq(courseTable.majorId, majorTable.id))
    .where(inArray(majorTable.id, majorIds));
}
