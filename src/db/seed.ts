import { db } from './index';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Seeding database...');

    // 1. Categories
    const categories = [
        { id: 'cat-1', name: 'Web Development' },
        { id: 'cat-2', name: 'Data Science' },
        { id: 'cat-3', name: 'Design' },
    ];
    await db.insert(schema.categories).values(categories);

    // 2. Users (Password: password123)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
        { id: 'user-admin', name: 'Admin User', email: 'admin@golearn.com', password: hashedPassword, role: 'admin' as const },
        { id: 'user-instructor', name: 'Jane Instructor', email: 'jane@golearn.com', password: hashedPassword, role: 'instructor' as const },
        { id: 'user-student', name: 'Demo Student', email: 'demo@golearn.com', password: hashedPassword, role: 'student' as const },
    ];
    await db.insert(schema.users).values(users);

    // 3. Courses
    const courses = [
        {
            id: 'course-1',
            title: 'Fullstack Next.js 14',
            description: 'Master Next.js 14 with the App Router and Drizzle ORM.',
            instructorId: 'user-instructor',
            categoryId: 'cat-1',
            price: 49.99,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: 'course-2',
            title: 'Data Visualization with Python',
            description: 'Learn to create stunning visualizations using Matplotlib and Seaborn.',
            instructorId: 'user-instructor',
            categoryId: 'cat-2',
            price: 39.99,
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bbda38a594a0?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: 'course-3',
            title: 'Modern UI/UX Principles',
            description: 'Design beautiful interfaces that convert.',
            instructorId: 'user-instructor',
            categoryId: 'cat-3',
            price: 29.99,
            thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
        },
    ];
    await db.insert(schema.courses).values(courses);

    // 4. Lessons
    const lessons = [
        {
            id: 'lesson-1',
            courseId: 'course-1',
            title: 'Introduction to App Router',
            videoUrl: 'https://www.youtube.com/embed/RGoj5Phi2pM',
            content: 'Learn the basics of the Next.js App Router.',
            orderIndex: 1,
        },
        {
            id: 'lesson-2',
            courseId: 'course-1',
            title: 'Drizzle ORM Setup',
            videoUrl: 'https://www.youtube.com/embed/n_U58S-XEEg',
            content: 'Setting up Drizzle with SQLite.',
            orderIndex: 2,
        },
    ];
    await db.insert(schema.lessons).values(lessons);

    // 5. Quizzes
    const quizzes = [
        { id: 'quiz-1', lessonId: 'lesson-1', title: 'App Router Basics Quiz' },
    ];
    await db.insert(schema.quizzes).values(quizzes);

    // 6. Questions
    const questions = [
        {
            id: 'q-1',
            quizId: 'quiz-1',
            question: 'Which directory is used for the App Router in Next.js 13+?',
            optionA: 'pages',
            optionB: 'app',
            optionC: 'src',
            optionD: 'api',
            correctAnswer: 'app',
        },
    ];
    await db.insert(schema.questions).values(questions);

    console.log('Seeding complete.');
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
