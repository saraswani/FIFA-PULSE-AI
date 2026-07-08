import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("<Button />", () => {
  it("renders its children as accessible text", () => {
    render(<Button>Deploy Team</Button>);
    expect(
      screen.getByRole("button", { name: /deploy team/i }),
    ).toBeInTheDocument();
  });

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Evacuate</Button>);
    const btn = screen.getByRole("button", { name: /evacuate/i });
    expect(btn.className).toMatch(/destructive/);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button", { name: /off/i })).toBeDisabled();
  });
});
