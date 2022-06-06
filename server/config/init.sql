CREATE TABLE IF NOT EXISTS "student" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"hash"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "incompatible_courses" (
	"courseCode"	TEXT NOT NULL,
	"incompatibleWith"	TEXT NOT NULL,
	PRIMARY KEY("courseCode","incompatibleWith"),
	FOREIGN KEY("incompatibleWith") REFERENCES "course"("code") ON UPDATE CASCADE,
	FOREIGN KEY("courseCode") REFERENCES "course"("code") ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "study_plan" (
	"id"	INTEGER NOT NULL,
	"option"	INTEGER NOT NULL,
	"credits"	INTEGER NOT NULL,
	"studentId"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("studentId") REFERENCES "student"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "study_plan_courses" (
	"studyPlanId"	INTEGER NOT NULL,
	"courseCode"	TEXT NOT NULL,
	PRIMARY KEY("studyPlanId","courseCode"),
	FOREIGN KEY("studyPlanId") REFERENCES "study_plan"("id") ON DELETE CASCADE,
	FOREIGN KEY("courseCode") REFERENCES "course"("code") ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "course" (
	"code"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"credits"	INTEGER NOT NULL,
	"maxStudents"	INTEGER,
	"preparatoryCourse"	TEXT,
	PRIMARY KEY("code"),
	FOREIGN KEY("preparatoryCourse") REFERENCES "course"("code") ON UPDATE CASCADE
);
