import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import {
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import "./mi_logoloop.css";

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((img) => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener("load", handleImageLoad, { once: true });
        htmlImg.addEventListener("error", handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const LogoLoop = memo(
  ({
    logos = [], // will be replaced with DEFAULT_LOGOS if empty
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 36,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = "Partner logos",
    className,
    style,
  }) => {
    // Small inline default logos so the component is visible even if no `logos` prop is passed.
    // Using simple SVG data URIs to avoid external network dependency and ensure immediate visibility.
    const DEFAULT_LOGOS = [
      {
        node: <FaGoogle aria-hidden />,
        ariaLabel: "Google",
        title: "Google",
        href: "https://about.google",
      },
      {
        node: <FaMicrosoft aria-hidden />,
        ariaLabel: "Microsoft",
        title: "Microsoft",
        href: "https://www.microsoft.com",
      },
      {
        node: <FaAmazon aria-hidden />,
        ariaLabel: "Amazon",
        title: "Amazon",
        href: "https://www.amazon.com",
      },
      {
        node: <FaFacebook aria-hidden />,
        ariaLabel: "Meta",
        title: "Meta",
        href: "https://about.facebook.com",
      },
      {
        node: <FaLinkedin aria-hidden />,
        ariaLabel: "LinkedIn",
        title: "LinkedIn",
        href: "https://www.linkedin.com",
      },
    ];

    // If no logos provided, fall back to DEFAULT_LOGOS so the component is visible.
    const effectiveLogos = logos && logos.length > 0 ? logos : DEFAULT_LOGOS;
    const containerRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === "left" ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth =
        seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useResizeObserver(
      updateDimensions,
      [containerRef, seqRef],
      [logos, gap, logoHeight]
    );

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);

    const animationSettings = useMemo(() => {
      const velocity = targetVelocity;
      const absoluteVelocity = Math.abs(velocity);

      if (seqWidth <= 0 || absoluteVelocity === 0) {
        return {
          distance: 0,
          duration: 0,
        };
      }

      return {
        distance: velocity >= 0 ? -seqWidth : seqWidth,
        duration: seqWidth / absoluteVelocity,
      };
    }, [targetVelocity, seqWidth]);

    const cssVariables = useMemo(
      () => ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        [
          "logoloop",
          fadeOut && "logoloop--fade",
          scaleOnHover && "logoloop--scale-hover",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      [fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback((item, key) => {
      const isNodeItem = "node" in item;

      const content = isNodeItem ? (
        <span
          className="logoloop__node"
          aria-hidden={!!item.href && !item.ariaLabel}
        >
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAriaLabel = isNodeItem
        ? item.ariaLabel ?? item.title
        : item.alt ?? item.title;

      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || "logo link"}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      );
    }, []);

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {effectiveLogos.map((item, itemIndex) =>
              renderLogoItem(item, `${copyIndex}-${itemIndex}`)
            )}
          </ul>
        )),
      [copyCount, effectiveLogos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: toCssLength(width) ?? "100%",
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style]
    );

    const trackStyle = useMemo(() => {
      const playState = pauseOnHover && isHovered ? "paused" : "running";
      const { distance, duration } = animationSettings;

      if (duration === 0) {
        return {
          animation: "none",
          transform: "translate3d(0, 0, 0)",
        };
      }

      return {
        animationDuration: `${duration}s`,
        animationPlayState: playState,
        "--logoloop-animation-distance": `${distance}px`,
      };
    }, [animationSettings, pauseOnHover, isHovered]);

    const isAnimated = animationSettings.duration > 0;

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="logoloop__track"
          style={trackStyle}
          data-animated={isAnimated}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
