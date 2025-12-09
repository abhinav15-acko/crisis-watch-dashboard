import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Circle } from "lucide-react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const fetchTodo = async (): Promise<Todo> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!response.ok) {
    throw new Error("Failed to fetch todo");
  }
  return response.json();
};

export default function TodoDemo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todo"],
    queryFn: fetchTodo,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Todo Demo</h1>
        <p className="text-muted-foreground mt-1">
          Fetching data from JSONPlaceholder API
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Todo Item</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : error ? (
            <p className="text-destructive">Error loading todo</p>
          ) : data ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {data.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <p className="text-foreground">{data.title}</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>ID: {data.id}</p>
                <p>User ID: {data.userId}</p>
                <p>Status: {data.completed ? "Completed" : "Pending"}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
