import { useEffect } from "react";
import { MODULE_IDS } from "../config/urls";
import { fetchMembership } from "../store/slices/membershipSlice";
import { getImageUrl } from "../utils/imageUrl";
import {
  getMembershipContext,
  getModuleIdByName,
  getRequestContext,
  normalizeCategory,
  renderGameCards,
} from "../utils/appHelpers";

export function usePageModuleEffects({
  path,
  rootRef,
  cardModuleState,
  searchWithDevice,
  qrContext,
  deviceId,
  returningCustomer,
  menuAppUrl,
  headerModulesState,
  packageModuleState,
  membershipState,
  dispatch,
}) {
  const gamesType = path === "/board-games" ? "board-games" : null;
  const isPlaystationPage = path === "/playstation";
  const isBoardGamesPage = path === "/board-games";
  const usesCardModuleGrid = isPlaystationPage || isBoardGamesPage;

  // 1. Board-games data fetching — Card Module API se ab aata hai; old fetchGames ko skip karo.
  useEffect(() => {
    if (!gamesType) return;
    return undefined;
  }, [gamesType]);

  // Old board-games render hook bhi disable karo — card module grid hook ab render karega.
  useEffect(() => {
    if (!gamesType) return undefined;
    return undefined;
  }, [gamesType]);

  // Card Module Grid renderer — Playstation aur Board Games dono ke liye same flow.
  useEffect(() => {
    if (!usesCardModuleGrid) return undefined;

    const pageMode = isPlaystationPage ? "playstation" : "board-games";
    const prefix = isPlaystationPage ? "ps" : "bg";
    const fallbackCategory = isPlaystationPage ? "Playstation" : "Board Game";
    const loadingText = isPlaystationPage ? "Loading Playstation sessions..." : "Loading Board Games...";
    const errorText = "Unable to load sessions right now.";
    const fallbackImgPath = isPlaystationPage ? "/assets/images/ps/" : "/assets/images/board-games/";

    const grid = rootRef.current?.querySelector(`#${prefix}-grid`);
    const empty = rootRef.current?.querySelector(`#${prefix}-empty`);
    const count = rootRef.current?.querySelector(`#${prefix}-count`);
    const filters = rootRef.current?.querySelector(`#${prefix}-filters`);
    const searchInput = rootRef.current?.querySelector(`#${prefix}-search`);
    if (!grid || !filters) return undefined;

    const { items: cards, status, error } = cardModuleState;
    const mappedCards = cards.map((card, index) => {
      const categoryName = card.categoryName || fallbackCategory;
      const categories = [normalizeCategory(categoryName)].filter(Boolean);
      const players = card.features?.[0] || "1-4 Players";
      const duration = card.features?.[1] || card.priceLabel || "60 min";
      const difficulty = card.features?.[2] || card.subtitle || "Casual";
      const rawStatus = (card.status || "").toUpperCase();
      let gameStatus = "available";
      if (rawStatus === "IN_USE") gameStatus = "in-use";
      else if (rawStatus !== "AVAILABLE" && rawStatus !== "ACTIVE") gameStatus = "unavailable";
      return {
        id: card.uidCardId || `${prefix}-card-${index + 1}`,
        name: card.name,
        categories,
        searchText: [
          card.name,
          card.code,
          card.description,
          card.subtitle,
          categoryName,
          players,
          duration,
          difficulty,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
        cover:
          card.code ||
          card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
          `card-${index + 1}`,
        image: card.imageUrl
          ? getImageUrl(card.imageUrl)
          : `${fallbackImgPath}${card.code || "placeholder"}.webp`,
        players,
        duration,
        difficulty,
        status: gameStatus,
      };
    });

    let activeCategory =
      filters.querySelector("[data-filter].is-active")?.dataset.filter || "all";
    let query = searchInput?.value || "";

    const render = () => {
      if (status === "loading" || status === "idle") {
        grid.innerHTML = `<p class="bg-loading">${loadingText}</p>`;
        grid.hidden = false;
        if (empty) empty.hidden = true;
        if (count) count.textContent = "";
        return;
      }
      if (status === "failed") {
        console.error(`Unable to load ${pageMode} cards`, error);
        grid.innerHTML = "";
        grid.hidden = true;
        if (empty) {
          empty.hidden = false;
          const message = empty.querySelector("p");
          if (message) message.textContent = errorText;
        }
        return;
      }
      const normalizedQuery = query.trim().toLowerCase();
      const visible = mappedCards.filter((game) => {
        const categoryMatches =
          activeCategory === "all" ||
          game.categories.some(
            (category) =>
              category === activeCategory || category.startsWith(`${activeCategory}-`),
          );
        const searchMatches = !normalizedQuery || game.searchText.includes(normalizedQuery);
        return categoryMatches && searchMatches;
      });
      const moduleName = pageMode === "playstation" ? "Playstation" : "Board Games";
      const moduleId =
        getModuleIdByName(headerModulesState.items, moduleName) ||
        new URLSearchParams(searchWithDevice).get("moduleId") ||
        "";
      grid.innerHTML = renderGameCards(
        visible,
        pageMode,
        searchWithDevice,
        qrContext,
        deviceId,
        returningCustomer,
        menuAppUrl,
        moduleId,
      );
      grid.hidden = visible.length === 0;
      if (empty) empty.hidden = visible.length > 0;
      if (count) count.textContent = `${visible.length} session${visible.length === 1 ? "" : "s"}`;
    };

    const onFilter = (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeCategory = button.dataset.filter || "all";
      filters.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    };
    const onSearch = () => {
      query = searchInput.value;
      render();
    };
    const resetButton = rootRef.current?.querySelector(`#${prefix}-reset-filters`);
    const onReset = () => {
      activeCategory = "all";
      query = "";
      if (searchInput) searchInput.value = "";
      filters.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item.dataset.filter === "all";
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    };

    filters.addEventListener("click", onFilter);
    searchInput?.addEventListener("input", onSearch);
    resetButton?.addEventListener("click", onReset);
    render();

    return () => {
      filters.removeEventListener("click", onFilter);
      searchInput?.removeEventListener("input", onSearch);
      resetButton?.removeEventListener("click", onReset);
    };
  }, [usesCardModuleGrid, isPlaystationPage, isBoardGamesPage, cardModuleState, searchWithDevice, qrContext, deviceId, returningCustomer, menuAppUrl]);

  const isMakeMomentPage = path === "/make-it-your-moment";
  const usesMomentCardGrid = isMakeMomentPage;

  useEffect(() => {
    if (!isMakeMomentPage) return undefined;
    const root = rootRef.current;
    const filters = root?.querySelector("#moment-filters");
    const grid = root?.querySelector("#moment-grid");
    const count = root?.querySelector("#moment-count");
    const searchInput = root?.querySelector("#moment-search");
    if (!filters || !grid) return undefined;

    let activeFilter = "all";
    let searchQuery = searchInput?.value.trim().toLowerCase() || "";
    const render = () => {
      let visibleCount = 0;
      grid.querySelectorAll(".bg-card").forEach((card) => {
        const categories = (card.dataset.categories || "").split(/\s+/);
        const searchText = `${card.dataset.name || ""} ${card.textContent || ""}`.toLowerCase();
        const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
        const matchesSearch = !searchQuery || searchText.includes(searchQuery);
        card.hidden = !matchesFilter || !matchesSearch;
        if (!card.hidden) visibleCount += 1;
      });
      if (count) count.textContent = `${visibleCount} moment${visibleCount === 1 ? "" : "s"}`;
    };
    const onFilter = (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button || !filters.contains(button)) return;
      activeFilter = button.dataset.filter || "all";
      filters.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    };
    const onSearch = () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
    };
    filters.addEventListener("click", onFilter);
    searchInput?.addEventListener("input", onSearch);
    render();
    return () => {
      filters.removeEventListener("click", onFilter);
      searchInput?.removeEventListener("input", onSearch);
    };
  }, [isMakeMomentPage, cardModuleState]);

  // 1. Make-It-Your-Moment: OLD customMoments API + render disabled. Ab Card Module use karo.
  useEffect(() => {
    if (!isMakeMomentPage) return;
    return undefined;
  }, [isMakeMomentPage]);

  useEffect(() => {
    if (!isMakeMomentPage) return undefined;
    return undefined;
  }, [isMakeMomentPage]);

  // Make-It-Your-Moment Card Module renderer.
  useEffect(() => {
    if (!usesMomentCardGrid) return undefined;

    const prefix = "moment";
    const fallbackCategory = "Moment";
    const fallbackImgPath = "/assets/images/moments/";

    const grid = rootRef.current?.querySelector(`#${prefix}-grid`);
    if (!grid) return undefined;

    const count = rootRef.current?.querySelector(`#${prefix}-count`);
    const cards = [...grid.querySelectorAll(".bg-card")];
    let loading = grid.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      grid.prepend(loading);
    }

    const { items: momentCards, status, error } = cardModuleState;

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading moments...";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      if (count) count.textContent = "";
      return undefined;
    }
    if (status === "failed") {
      console.error("Unable to load moments", error);
      loading.textContent = "Unable to load moments right now.";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      if (count) count.textContent = "";
      return undefined;
    }

    loading.remove();
    const visibleCards = momentCards.filter((c) => c.isAvailable !== false);
    cards.forEach((card) => { card.hidden = true; });
    visibleCards.forEach((moment, index) => {
      const card = cards[index];
      if (!card) return;
      card.hidden = false;
      const category = moment.categoryName || fallbackCategory;
      card.dataset.name = moment.name.toLowerCase();
      card.dataset.categories = category.toLowerCase().replace(/\s+/g, "-");
      card.dataset.id = moment.uidCardId;
      const bookButton = card.querySelector("[data-action='book']");
      if (bookButton) bookButton.dataset.id = moment.uidCardId;
      const title = card.querySelector(".bg-card__title");
      const description = card.querySelector(".bg-card__desc");
      const price = card.querySelector(".bg-card__meta li span");
      const momentStatus = card.querySelector(".bg-card__status span:last-child");
      const image = card.querySelector(".bg-card__media img");
      if (title) title.textContent = moment.name;
      if (description && moment.description) description.textContent = moment.description;
      if (price) price.textContent = moment.priceLabel || (moment.price ? `AED ${moment.price}` : "Custom");
      if (momentStatus) {
        if (moment.isInUse) momentStatus.textContent = "In Use";
        else if (moment.isAvailable) momentStatus.textContent = "Available";
        else momentStatus.textContent = "Unavailable";
      }
      if (image) image.src = moment.imageUrl ? getImageUrl(moment.imageUrl) : `${fallbackImgPath}placeholder.webp`;
    });
    const availableCount = visibleCards.length;
    if (count) count.textContent = `${availableCount} moment${availableCount === 1 ? "" : "s"}`;
    if (!availableCount) {
      const empty = document.createElement("p");
      empty.className = "bg-loading";
      empty.textContent = "No moments are available right now.";
      grid.append(empty);
      return () => empty.remove();
    }
    return undefined;
  }, [usesMomentCardGrid, isMakeMomentPage, cardModuleState, searchWithDevice, qrContext, deviceId]);

  const celebrationType = path === "/birthday-celebrations" ? "birthday" : path === "/corporate-bookings" ? "corporate" : null;

  // 1. OLD celebration packages API disabled. Ab PackageModule items use hote hain.
  useEffect(() => {
    if (!celebrationType) return;
    return undefined;
  }, [celebrationType]);

  // 2. Rendering + selection UI — PackageModule Redux items (children flatten karke).
  useEffect(() => {
    if (!celebrationType) return undefined;

    const packageGrid = rootRef.current?.querySelector(".offer-packages");
    const bookingLink = rootRef.current?.querySelector(".offer-sheet__cta");
    if (!packageGrid || !bookingLink) return undefined;

    const defaultModuleId = MODULE_IDS[`${celebrationType}Packages`] || MODULE_IDS.packages;
    const celebrationContext = getRequestContext(searchWithDevice, qrContext);

    const cards = [...packageGrid.querySelectorAll(".offer-package")];
    let loading = packageGrid.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      packageGrid.prepend(loading);
    }
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-package";
    bookingLink.setAttribute("aria-disabled", "true");

    const onSelect = (event) => {
      const selectedCard = event.target.closest(".offer-package[data-package-details]");
      if (!selectedCard || !packageGrid.contains(selectedCard)) return;
      const packageDetails = selectedCard.dataset.packageDetails;
      cards.forEach((card) => card.classList.toggle("is-selected", card === selectedCard));
      bookingLink.dataset.packageDetails = packageDetails;
      try {
        bookingLink.textContent = `Book ${JSON.parse(packageDetails).name}`;
      } catch {
        bookingLink.textContent = "Book selected package";
      }
      bookingLink.removeAttribute("aria-disabled");
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect(event);
    };
    packageGrid.addEventListener("click", onSelect);
    packageGrid.addEventListener("keydown", onKeyDown);

    const { items: rawPackages, status, error } = packageModuleState;

    // Flatten: parent packages render first, then each child also becomes a selectable card.
    const packages = [];
    rawPackages.forEach((pkg) => {
      packages.push(pkg);
      if (Array.isArray(pkg.children) && pkg.children.length > 0) {
        pkg.children.forEach((child) => packages.push({ ...child, parentName: pkg.name }));
      }
    });

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading packages...";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      bookingLink.textContent = "Select a package first";
    } else if (status === "failed") {
      console.error(`Unable to load ${celebrationType} packages`, error);
      loading.textContent = "Unable to load packages right now.";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      bookingLink.textContent = "Select a package first";
    } else {
      loading.remove();
      cards.forEach((card) => { card.hidden = true; });
      packages.forEach((item, index) => {
        const card = cards[index];
        if (!card) return;
        card.hidden = false;
        let title = card.querySelector("h2");
        if (!title) {
          title = document.createElement("h2");
          card.prepend(title);
        }
        let description = card.querySelector(":scope > p");
        let meta = card.querySelector(".offer-package__meta");
        let parentLabel = card.querySelector(".offer-package__parent-label");
        if (item.parentName && !parentLabel) {
          parentLabel = document.createElement("p");
          parentLabel.className = "offer-package__parent-label";
          card.insertBefore(parentLabel, title);
        }
        if ((item.timing || item.subtitle) && !meta) {
          meta = document.createElement("p");
          meta.className = "offer-package__meta";
          card.insertBefore(meta, description || title.nextSibling);
        }
        if (!description) {
          description = document.createElement("p");
          card.append(description);
        }
        const priceText = item.priceLabel || (item.price ? `AED ${item.price}` : "");
        if (title) title.textContent = `${item.name}${priceText ? ` — ${priceText}` : ""}`;
        if (item.timing || item.subtitle) {
          if (meta) meta.textContent = item.timing || item.subtitle;
        }
        if (item.parentName && parentLabel) {
          parentLabel.textContent = `Part of — ${item.parentName}`;
          parentLabel.hidden = false;
          card.classList.add("offer-package--child");
        } else if (parentLabel) {
          parentLabel.textContent = "";
          parentLabel.hidden = true;
          card.classList.remove("offer-package--child");
        }
        if (description) description.textContent = item.description || item.parentName || "";
        const details = JSON.stringify({
          id: item.uidPackageId || item.id,
          uidPackageItemId: item.uidPackageId,
          uidParentPackageItemId: item.uidParentPackageItemId || "",
          name: item.name,
          price: priceText,
          priceLabel: item.priceLabel,
          priceValue: item.price,
          description: item.description || "",
          moduleId: item.moduleId || defaultModuleId,
          uidHeaderModuleId: item.moduleId || defaultModuleId,
          type: `${celebrationType}-package`,
          categoryName: celebrationType === "birthday" ? "Birthday Celebrations" : "Corporate Bookings",
          category: celebrationType === "birthday" ? "BIRTHDAY" : "CORPORATE",
          bookingType: celebrationType === "birthday" ? "Birthday Celebration" : "Corporate Booking",
          parentName: item.parentName || "",
          companyId: celebrationContext.companyId || "",
          branchId: celebrationContext.branchId || "",
          tableSessionId: celebrationContext.tableSessionId || "",
          tableId: celebrationContext.tableId || "",
          tableNumber: celebrationContext.tableNumber || "",
        });
        card.dataset.packageDetails = details;
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Select ${item.name}`);
      });
      if (!packages.length) {
        loading.textContent = "No packages are available right now.";
        packageGrid.append(loading);
      }
      bookingLink.textContent = "Select a package first";
    }

    return () => {
      packageGrid.removeEventListener("click", onSelect);
      packageGrid.removeEventListener("keydown", onKeyDown);
    };
  }, [celebrationType, packageModuleState, qrContext, searchWithDevice]);

  // 1. Data fetching — Redux thunk.
  useEffect(() => {
  if (path !== "/privilege-membership") return;

  const membershipContext = getMembershipContext(
    searchWithDevice,
    qrContext,
    headerModulesState.items
  );


  dispatch(fetchMembership(membershipContext));
}, [
  path,
  searchWithDevice,
  qrContext,
  headerModulesState.items,
  dispatch,
]);

  // 2. Rendering — Redux state (membership slice) se.
  useEffect(() => {
    if (path !== "/privilege-membership") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const bookingLink = panel?.querySelector(".offer-sheet__cta");
    if (!panel || !bookingLink) return undefined;

    const context = getMembershipContext(searchWithDevice, qrContext);
    let loading = panel.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      panel.append(loading);
    }
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#join-membership";
    bookingLink.setAttribute("aria-disabled", "true");

    const { data: membership, status, error } = membershipState;

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading membership...";
      loading.hidden = false;
      bookingLink.textContent = "Loading membership...";
      return undefined;
    }
    if (status === "failed" || !membership) {
      console.error("Unable to load membership", error);
      loading.textContent = "Unable to load membership right now.";
      loading.hidden = false;
      bookingLink.textContent = "Membership unavailable";
      return undefined;
    }

    loading.remove();
    const name = membership.name || membership.membershipName || "Desire Privilege Membership";
    const price = membership.priceLabel || membership.price || "";
    const description = membership.subtitle || "";
    const details = JSON.stringify({
      id: membership.id || membership.membershipId || context.moduleId,
      name,
      price,
      description,
      terms: membership.terms || "",
      features: membership.features || [],
      type: "membership",
      categoryName: "Desire Privilege Membership",
      category: "MEMBERSHIP",
      bookingType: "Membership",
      moduleId: context.moduleId,
      companyId: context.companyId || "",
      branchId: context.branchId || "",
      tableSessionId: context.tableSessionId || "",
      tableId: context.tableId || "",
      tableNumber: context.tableNumber || "",
    });
    let summary = panel.querySelector(".offer-sheet__membership-summary");
    if (!summary) {
      summary = document.createElement("p");
      summary.className = "offer-sheet__membership-summary";
      panel.append(summary);
    }
    summary.textContent = `${name}${price ? ` — ${price}` : ""}${description ? ` · ${description}` : ""}`;
    bookingLink.dataset.packageDetails = details;
    bookingLink.textContent = `Join ${name}`;
    bookingLink.removeAttribute("aria-disabled");
    const terms = panel.querySelector(".offer-sheet__terms");
    if (terms && membership.terms) terms.textContent = membership.terms;

    return () => {
      summary?.remove();
    };
  }, [path, membershipState, searchWithDevice, qrContext]);

  useEffect(() => {
    if (path !== "/exclusive-offers") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const offerGrid = panel?.querySelector(".offer-packages");
    const bookingLink = panel?.querySelector(":scope > .offer-sheet__cta");
    if (!offerGrid || !bookingLink) return undefined;

    const cards = [...offerGrid.querySelectorAll(".offer-package")];
    const originalHref = bookingLink.href;
    const offerContext = getRequestContext(searchWithDevice, qrContext);
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-offer";
    bookingLink.textContent = "Select an offer first";
    bookingLink.setAttribute("aria-disabled", "true");

    const selectCard = (card) => {
      const title = card.querySelector("h2")?.textContent?.trim() || "Exclusive Offer";
      const description = [...card.querySelectorAll("p, li")]
        .map((element) => element.textContent.trim())
        .filter(Boolean)
        .join(" ");
      const price = title.match(/AED\s*[\d.]+|\d+%|Complimentary/i)?.[0] || "";
      const details = {
        id: card.dataset.offerId || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: title,
        price,
        description,
        type: "exclusive-offer",
        categoryName: "Exclusive Offers",
        category: "EXCLUSIVE_OFFER",
        bookingType: "Exclusive Offer",
        moduleId: offerContext.moduleId,
        companyId: offerContext.companyId || "",
        branchId: offerContext.branchId || "",
        tableSessionId: offerContext.tableSessionId || "",
        tableId: offerContext.tableId || "",
        tableNumber: offerContext.tableNumber || "",
      };
      cards.forEach((item) => item.classList.toggle("is-selected", item === card));
      bookingLink.dataset.packageDetails = JSON.stringify(details);
      bookingLink.textContent = `Book ${title}`;
      bookingLink.removeAttribute("aria-disabled");
    };
    const onClick = (event) => {
      const card = event.target.closest(".offer-package");
      if (!card || !offerGrid.contains(card) || event.target.closest("a")) return;
      selectCard(card);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".offer-package");
      if (!card) return;
      event.preventDefault();
      selectCard(card);
    };
    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Select ${card.querySelector("h2")?.textContent?.trim() || "exclusive offer"}`);
    });
    offerGrid.addEventListener("click", onClick);
    offerGrid.addEventListener("keydown", onKeyDown);

    return () => {
      offerGrid.removeEventListener("click", onClick);
      offerGrid.removeEventListener("keydown", onKeyDown);
      bookingLink.href = originalHref;
      delete bookingLink.dataset.packageBook;
      delete bookingLink.dataset.packageDetails;
      bookingLink.textContent = "Ask About Offers";
      bookingLink.removeAttribute("aria-disabled");
      cards.forEach((card) => {
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-label");
        card.classList.remove("is-selected");
      });
    };
  }, [path, searchWithDevice, qrContext]);
}
