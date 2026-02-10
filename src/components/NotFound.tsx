import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
