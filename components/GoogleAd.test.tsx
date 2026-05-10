import { render, waitFor } from "@testing-library/react";
import GoogleAd from "@/components/GoogleAd";

describe("GoogleAd Component", () => {
  beforeEach(() => {
    // Mock adsbygoogle
    window.adsbygoogle = [];
    // Set default client ID for tests
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-test123";

    // Mock offsetWidth and offsetHeight to simulate visible container
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 160,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    delete (window as { adsbygoogle?: unknown[] }).adsbygoogle;
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  });

  describe("Rendering", () => {
    it("renders ins element with correct data attributes when container is visible", async () => {
      const { container } = render(<GoogleAd slot="1234567890" />);

      await waitFor(() => {
        const ins = container.querySelector("ins.adsbygoogle");
        expect(ins).toBeInTheDocument();
      });

      const ins = container.querySelector("ins.adsbygoogle");
      expect(ins).toHaveAttribute("data-ad-slot", "1234567890");
      expect(ins).toHaveStyle({ display: "block" });
      expect(ins).toHaveAttribute("data-full-width-responsive", "true");
    });

    it("applies format when provided", async () => {
      const { container } = render(
        <GoogleAd slot="1234567890" format="vertical" />,
      );

      await waitFor(() => {
        const ins = container.querySelector("ins.adsbygoogle");
        expect(ins).toBeInTheDocument();
      });

      const ins = container.querySelector("ins.adsbygoogle");
      expect(ins).toHaveAttribute("data-ad-format", "vertical");
    });

    it("uses auto format by default", async () => {
      const { container } = render(<GoogleAd slot="1234567890" />);

      await waitFor(() => {
        const ins = container.querySelector("ins.adsbygoogle");
        expect(ins).toBeInTheDocument();
      });

      const ins = container.querySelector("ins.adsbygoogle");
      expect(ins).toHaveAttribute("data-ad-format", "auto");
    });

    it("does not render ins element when container has no dimensions", () => {
      // Mock zero dimensions (hidden container)
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        value: 0,
      });
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        value: 0,
      });

      const { container } = render(<GoogleAd slot="1234567890" />);

      // Should not render ins element for hidden containers
      const ins = container.querySelector("ins.adsbygoogle");
      expect(ins).not.toBeInTheDocument();
    });
  });

  describe("Layout Shift Prevention", () => {
    it("reserves space with minimum dimensions", () => {
      const { container } = render(<GoogleAd slot="1234567890" />);
      const wrapper = container.firstChild as HTMLElement;

      // Should have min-h-[600px] and w-[160px] for layout stability
      expect(wrapper).toHaveClass("min-h-[600px]");
      expect(wrapper).toHaveClass("w-[160px]");
      expect(wrapper).toHaveClass("bg-gray-200");
    });
  });

  describe("Client ID", () => {
    it("uses NEXT_PUBLIC_ADSENSE_CLIENT_ID from environment", async () => {
      const { container } = render(<GoogleAd slot="1234567890" />);

      await waitFor(() => {
        const ins = container.querySelector("ins.adsbygoogle");
        expect(ins).toBeInTheDocument();
      });

      const ins = container.querySelector("ins.adsbygoogle");
      expect(ins).toHaveAttribute("data-ad-client", "ca-pub-test123");
    });

    it("shows placeholder when NEXT_PUBLIC_ADSENSE_CLIENT_ID is missing", () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

      const { container } = render(<GoogleAd slot="1234567890" />);

      // Should show grey placeholder instead of ad
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("bg-gray-200");
      expect(
        container.querySelector("ins.adsbygoogle"),
      ).not.toBeInTheDocument();
    });
  });
});
