import { render, screen, act } from "@testing-library/react";
import Home from "@/app/page";

// Mock GoogleAd component
jest.mock("@/components/GoogleAd", () => {
  return function GoogleAd({ slot }: { slot: string }) {
    return <div data-testid={`google-ad-${slot}`}>Google Ad Placeholder</div>;
  };
});

// Mock react-chessboard to avoid canvas/rendering issues in tests
jest.mock("react-chessboard", () => ({
  Chessboard: ({
    options,
  }: {
    options: {
      position: string;
      onPieceDrop: (args: {
        sourceSquare: string;
        targetSquare: string | null;
      }) => boolean;
    };
  }) => (
    <div data-testid="chessboard" data-position={options.position}>
      <div
        data-testid="piece-drop-handler"
        onClick={() => {
          // Simulate a valid move (e2 to e4)
          if (options.onPieceDrop) {
            act(() => {
              options.onPieceDrop({ sourceSquare: "e2", targetSquare: "e4" });
            });
          }
        }}
      />
    </div>
  ),
}));

describe("Chess Board Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<Home />);
      expect(document.querySelector("body")).toBeInTheDocument();
    });

    it("displays the chessboard component", () => {
      render(<Home />);
      const chessboard = screen.getByTestId("chessboard");
      expect(chessboard).toBeInTheDocument();
    });

    it("displays only chessboard - no visible headers or navigation", () => {
      render(<Home />);
      // Semantic HTML content exists for SEO but is in hidden section
      const seoSection = document.querySelector(
        'section[aria-label="About Pass & Play Chess"]',
      );
      expect(seoSection).toBeInTheDocument();
      expect(seoSection).toHaveClass("sr-only");

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();

      // Should not have navigation
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      // Should not have default Next.js text
      expect(screen.queryByText(/To get started/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Deploy/i)).not.toBeInTheDocument();
    });
  });

  describe("SEO Content", () => {
    it("sr-only section contains expected keywords for search engines", () => {
      render(<Home />);
      const seoSection = document.querySelector(".sr-only");

      expect(seoSection).toBeInTheDocument();
      expect(seoSection).toHaveAttribute(
        "aria-label",
        "About Pass & Play Chess",
      );

      // Verify h1 contains brand name
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent(/Pass & Play Chess/i);

      // Verify target SEO keywords present (multiple matches expected)
      const allText = seoSection?.textContent || "";
      expect(allText).toMatch(/pass and play chess/i);
      expect(allText).toMatch(/offline/i);
      expect(allText).toMatch(/two players/i);
    });

    it("sr-only content is hidden but accessible to screen readers", () => {
      render(<Home />);
      const seoSection = document.querySelector(".sr-only");

      // Verify sr-only class present (actual hiding is handled by Tailwind CSS)
      expect(seoSection).toHaveClass("sr-only");

      // Verify content is in the DOM (accessible to screen readers and search engines)
      expect(seoSection).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("has fullscreen layout with flexbox centering", () => {
      const { container } = render(<Home />);
      // Fragment children are direct children: section (0), div (1)
      const mainElement = container.children[1] as HTMLElement;

      expect(mainElement).toHaveStyle({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      });
    });

    it("board container is square and responsive", () => {
      const { container } = render(<Home />);
      // Fragment children: section (0), main layout div (1)
      const mainElement = container.children[1] as HTMLElement;
      // Board is the middle child (index 1) due to 3-column layout
      const boardContainer = mainElement.children[1] as HTMLElement;

      // Check that the board container has responsive styling
      const style = boardContainer.getAttribute("style");
      expect(style).toContain("width: 100%");
      expect(style).toContain("aspect-ratio: 1");
    });

    it("board container has responsive max-width constraint", () => {
      const { container } = render(<Home />);
      // Fragment children: section (0), main layout div (1)
      const mainElement = container.children[1] as HTMLElement;
      const boardContainer = mainElement.children[1] as HTMLElement;

      const style = boardContainer.getAttribute("style");
      expect(style).toContain("max-width");
    });
  });

  describe("Initial Position", () => {
    it("starts with standard chess starting position", () => {
      render(<Home />);
      const chessboard = screen.getByTestId("chessboard");
      // Standard chess starting position FEN
      const startingFen =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      expect(chessboard).toHaveAttribute("data-position", startingFen);
    });
  });

  describe("Move Handling", () => {
    it("updates position when valid move is made", () => {
      render(<Home />);
      const chessboard = screen.getByTestId("chessboard");

      // Initial position
      const startingFen =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      expect(chessboard).toHaveAttribute("data-position", startingFen);

      // Simulate a move (e2 to e4)
      const moveHandler = screen.getByTestId("piece-drop-handler");
      moveHandler.click();

      // After e2-e4, pawn should be on e4
      const updatedChessboard = screen.getByTestId("chessboard");
      const position = updatedChessboard.getAttribute("data-position");

      // Verify the pawn moved to e4 (4th rank in FEN)
      expect(position).toContain("4P3");
      // Verify it's black's turn
      expect(position).toContain(" b ");
    });

    it("provides onPieceDrop handler to chessboard", () => {
      render(<Home />);
      const chessboard = screen.getByTestId("chessboard");
      expect(chessboard).toBeInTheDocument();
      // The mock verifies the handler exists and can be called
    });
  });

  describe("Ad Layout", () => {
    it("renders two GoogleAd components", () => {
      render(<Home />);
      const leftAd = screen.getByTestId("google-ad-left-sidebar");
      const rightAd = screen.getByTestId("google-ad-right-sidebar");

      expect(leftAd).toBeInTheDocument();
      expect(rightAd).toBeInTheDocument();
    });

    it("ad wrappers have responsive visibility and centering classes", () => {
      const { container } = render(<Home />);
      // Fragment children: section (0), main layout div (1)
      const mainElement = container.children[1] as HTMLElement;

      // First and last children are ad wrapper divs
      const leftWrapper = mainElement.children[0] as HTMLElement;
      const rightWrapper = mainElement.children[2] as HTMLElement;

      // Wrappers should have 'hidden lg:flex flex-1 justify-center items-center'
      expect(leftWrapper).toHaveClass("hidden");
      expect(leftWrapper).toHaveClass("lg:flex");
      expect(leftWrapper).toHaveClass("flex-1");
      expect(leftWrapper).toHaveClass("justify-center");
      expect(leftWrapper).toHaveClass("items-center");

      expect(rightWrapper).toHaveClass("hidden");
      expect(rightWrapper).toHaveClass("lg:flex");
      expect(rightWrapper).toHaveClass("flex-1");
      expect(rightWrapper).toHaveClass("justify-center");
      expect(rightWrapper).toHaveClass("items-center");
    });

    it("uses 3-column flexbox layout with ads flanking board", () => {
      const { container } = render(<Home />);
      // Fragment children: section (0), main layout div (1)
      const mainElement = container.children[1] as HTMLElement;

      // Should have flexbox with justify-center
      expect(mainElement).toHaveStyle({ display: "flex" });
      expect(mainElement).toHaveStyle({ justifyContent: "center" });

      // Should have 3 children: left ad, board container, right ad
      expect(mainElement.children.length).toBe(3);
    });

    it("board remains centered between ad wrappers", () => {
      const { container } = render(<Home />);
      // Fragment children: section (0), main layout div (1)
      const mainElement = container.children[1] as HTMLElement;

      // Structure: leftWrapper (0), board (1), rightWrapper (2)
      const leftWrapper = mainElement.children[0] as HTMLElement;
      const boardContainer = mainElement.children[1] as HTMLElement;
      const rightWrapper = mainElement.children[2] as HTMLElement;

      // Verify ads are in wrappers
      expect(
        leftWrapper.querySelector('[data-testid="google-ad-left-sidebar"]'),
      ).toBeInTheDocument();
      expect(
        rightWrapper.querySelector('[data-testid="google-ad-right-sidebar"]'),
      ).toBeInTheDocument();

      // Middle child should be the board container
      expect(
        boardContainer.querySelector('[data-testid="chessboard"]'),
      ).toBeInTheDocument();
    });
  });
});
