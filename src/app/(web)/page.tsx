"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to Our Amazing Product
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover the power of our innovative solution that will
                revolutionize your workflow.
              </p>
            </div>
            <div className="space-x-4">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800"
      >
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <StarIcon className="size-6" />
                    <h3 className="text-xl font-bold">Feature {i}</h3>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    &quot;This product has completely transformed our business.
                    We couldn&apos;t be happier with the results!&quot;
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      alt={`Customer ${i}`}
                      className="rounded-full"
                      height="40"
                      src="/assets/placeholder.svg"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        CEO, Company {i}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section
        id="pricing"
        className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800"
      >
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {["Basic", "Pro", "Enterprise"].map((plan, i) => (
              <Card key={i} className={i === 1 ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-center text-2xl font-bold">
                    {plan}
                  </h3>
                  <p className="mb-4 text-center text-4xl font-bold">
                    ${i === 0 ? "9" : i === 1 ? "29" : "99"}
                    <span className="text-sm font-normal">/month</span>
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 size-5 text-green-500" />
                      Feature 1
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 size-5 text-green-500" />
                      Feature 2
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 size-5 text-green-500" />
                      Feature 3
                    </li>
                  </ul>
                  <Button className="w-full">
                    {i === 1 ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join thousands of satisfied customers and take your business to
                the next level.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
