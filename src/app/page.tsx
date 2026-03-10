import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  Zap,
  Star,
  GraduationCap
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const featuredCourses = [
    {
      id: "course-1",
      title: "Fullstack Next.js 14",
      instructor: "Jane Instructor",
      price: "$49.99",
      rating: 4.9,
      students: 1200,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
      category: "Web Development"
    },
    {
      id: "course-2",
      title: "Data Visualization",
      instructor: "Jane Instructor",
      price: "$39.99",
      rating: 4.8,
      students: 850,
      image: "https://images.unsplash.com/photo-1551288049-bbda38a594a0?auto=format&fit=crop&q=80&w=800",
      category: "Data Science"
    },
    {
      id: "course-3",
      title: "Modern UI/UX Design",
      instructor: "Jane Instructor",
      price: "$29.99",
      rating: 4.7,
      students: 2100,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
      category: "Design"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-fade-in">
              <Zap className="mr-2 h-4 w-4" />
              <span>Explore the newest courses in 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary max-w-4xl">
              Unlock Your Potential with <span className="text-primary/70">GoLearn</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
              Join thousands of students and start your journey to mastering new skills today.
              Top-quality courses taught by industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/courses">
                <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 rounded-full group">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/register?role=instructor">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-primary/20 hover:bg-primary/5 rounded-full">
                  Become an Instructor
                </Button>
              </Link>
            </div>

            {/* Social Proof / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 w-full max-w-4xl opacity-70">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">10k+</span>
                <span className="text-sm text-muted-foreground">Students</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">200+</span>
                <span className="text-sm text-muted-foreground">Courses</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">50+</span>
                <span className="text-sm text-muted-foreground">Instructors</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">4.9/5</span>
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Featured Courses</h2>
              <p className="text-muted-foreground mt-2">The most popular courses selected just for you.</p>
            </div>
            <Link href="/courses">
              <Button variant="ghost" className="text-primary hover:text-primary/80 group">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="group relative overflow-hidden rounded-2xl border bg-background transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase px-2 py-1 rounded">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{course.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({course.students} students)</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary leading-tight mb-2 group-hover:text-primary/70 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 border-y">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">Why Choose GoLearn?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We provide the best tools and resources to help you succeed in your learning journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Expert-Led Courses</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals who bring real-world experience to your screen.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Community Focused</h3>
              <p className="text-muted-foreground">
                Connect with peer learners and instructors to share knowledge and grow together.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Recognized Certs</h3>
              <p className="text-muted-foreground">
                Earn certificates that are recognized by top employers in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-tighter sm:text-5xl">Ready to Start Learning?</h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of students who are already learning on GoLearn LMS. Get unlimited access to all courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-12 px-8">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full h-12 px-8">
                  View All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">GoLearn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 GoLearn LMS. All rights reserved.
            </p>
            <div className="flex gap-6 uppercase text-[10px] font-bold tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
