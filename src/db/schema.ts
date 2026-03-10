import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: ["admin", "instructor", "student"] }).notNull().default("student"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses),
    enrollments: many(enrollments),
    quizResults: many(quizResults),
}));

export const categories = sqliteTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    courses: many(courses),
}));

export const courses = sqliteTable("courses", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    instructorId: text("instructor_id").notNull().references(() => users.id),
    categoryId: text("category_id").notNull().references(() => categories.id),
    price: real("price").notNull().default(0),
    thumbnail: text("thumbnail"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
    instructor: one(users, {
        fields: [courses.instructorId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [courses.categoryId],
        references: [categories.id],
    }),
    lessons: many(lessons),
    enrollments: many(enrollments),
}));

export const lessons = sqliteTable("lessons", {
    id: text("id").primaryKey(),
    courseId: text("course_id").notNull().references(() => courses.id),
    title: text("title").notNull(),
    videoUrl: text("video_url"),
    content: text("content"),
    orderIndex: integer("order_index").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    course: one(courses, {
        fields: [lessons.courseId],
        references: [courses.id],
    }),
    quizzes: many(quizzes),
}));

export const enrollments = sqliteTable("enrollments", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    courseId: text("course_id").notNull().references(() => courses.id),
    progress: integer("progress").notNull().default(0),
    enrolledAt: text("enrolled_at").default(sql`CURRENT_TIMESTAMP`),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
    user: one(users, {
        fields: [enrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    }),
}));

export const quizzes = sqliteTable("quizzes", {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id").notNull().references(() => lessons.id),
    title: text("title").notNull(),
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [quizzes.lessonId],
        references: [lessons.id],
    }),
    questions: many(questions),
}));

export const questions = sqliteTable("questions", {
    id: text("id").primaryKey(),
    quizId: text("quiz_id").notNull().references(() => quizzes.id),
    question: text("question").notNull(),
    optionA: text("option_a").notNull(),
    optionB: text("option_b").notNull(),
    optionC: text("option_c").notNull(),
    optionD: text("option_d").notNull(),
    correctAnswer: text("correct_answer").notNull(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [questions.quizId],
        references: [quizzes.id],
    }),
}));

export const quizResults = sqliteTable("quiz_results", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    quizId: text("quiz_id").notNull().references(() => quizzes.id),
    score: integer("score").notNull(),
});

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
    user: one(users, {
        fields: [quizResults.userId],
        references: [users.id],
    }),
    quiz: one(quizzes, {
        fields: [quizResults.quizId],
        references: [quizzes.id],
    }),
}));
