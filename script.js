// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    const isExpanded = navMenu.classList.contains("active")
    menuToggle.setAttribute("aria-expanded", isExpanded)
    menuToggle.setAttribute("aria-label", isExpanded ? "Fechar menu" : "Abrir menu")
  })

  // Close menu when clicking on a link
  const navLinks = navMenu.querySelectorAll("a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      menuToggle.setAttribute("aria-expanded", "false")
      menuToggle.setAttribute("aria-label", "Abrir menu")
    })
  })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && href !== "") {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  })
})

// Video play button functionality (placeholder)
const playButtons = document.querySelectorAll(".play-button")
playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("Funcionalidade de vídeo será implementada em breve!")
  })
})

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".team-member, .video-card, .link-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Book Review Form Submission
const reviewForm = document.getElementById("reviewForm")

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(reviewForm)
    const bookTitle = formData.get("bookTitle")
    const bookAuthor = formData.get("bookAuthor")
    const rating = formData.get("rating")
    const reviewText = formData.get("reviewText")
    const critique = formData.get("critique")
    const reviewerName = formData.get("reviewerName")

    // Create new review card
    const reviewsList = document.querySelector(".reviews-list")
    const newReview = createReviewCard({
      bookTitle,
      bookAuthor,
      rating,
      reviewText,
      critique,
      reviewerName,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    })

    // Insert at the beginning of reviews list
    const firstReview = reviewsList.querySelector(".review-card")
    if (firstReview) {
      firstReview.insertAdjacentHTML("beforebegin", newReview)
    } else {
      reviewsList.insertAdjacentHTML("beforeend", newReview)
    }

    // Reset form
    reviewForm.reset()

    // Show success message
    showNotification("Avaliação publicada com sucesso!")

    // Scroll to the new review
    setTimeout(() => {
      const newReviewElement = reviewsList.querySelector(".review-card")
      newReviewElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  })
}

// Library Finder Functionality
const libraryFinderForm = document.getElementById("libraryFinderForm")
const useLocationBtn = document.getElementById("useLocationBtn")
const libraryLoading = document.getElementById("libraryLoading")
const libraryResults = document.getElementById("libraryResults")

if (libraryFinderForm) {
  libraryFinderForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const locationInput = document.getElementById("locationInput")
    const location = locationInput.value.trim()

    if (location) {
      searchLibraries(location)
    } else {
      showNotification("Por favor, digite um endereço ou CEP")
    }
  })
}

if (useLocationBtn) {
  useLocationBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
      useLocationBtn.disabled = true
      useLocationBtn.textContent = "Obtendo localização..."

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log("[v0] User location:", latitude, longitude)
          searchLibrariesByCoords(latitude, longitude)
          useLocationBtn.disabled = false
          useLocationBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Usar Minha Localização
          `
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          showNotification("Não foi possível obter sua localização. Por favor, digite seu endereço.")
          useLocationBtn.disabled = false
          useLocationBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Usar Minha Localização
          `
        },
      )
    } else {
      showNotification("Geolocalização não é suportada pelo seu navegador")
    }
  })
}

// Library database with coordinates (São Paulo and Santos libraries)
const librariesDatabase = [
  // São Paulo libraries
  {
    name: "Biblioteca Mário de Andrade",
    address: "Rua da Consolação, 94 - Centro, São Paulo",
    city: "São Paulo",
    lat: -23.5505,
    lng: -46.6433,
    hours: "Seg-Sex: 8h-20h",
    collection: "Acervo: 100.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bma/",
  },
  {
    name: "Biblioteca Monteiro Lobato",
    address: "Rua General Jardim, 485 - Vila Buarque, São Paulo",
    city: "São Paulo",
    lat: -23.5447,
    lng: -46.6527,
    hours: "Seg-Sex: 9h-18h",
    collection: "Acervo: 45.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Infantojuvenil",
    address: "Rua Ministro Godói, 1020 - Perdizes, São Paulo",
    city: "São Paulo",
    lat: -23.5365,
    lng: -46.6795,
    hours: "Ter-Sáb: 10h-17h",
    collection: "Especializada em literatura infantil",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Alceu Amoroso Lima",
    address: "Rua Henrique Schaumann, 777 - Pinheiros, São Paulo",
    city: "São Paulo",
    lat: -23.5618,
    lng: -46.6729,
    hours: "Seg-Sex: 9h-19h, Sáb: 9h-13h",
    collection: "Acervo: 35.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Viriato Corrêa",
    address: "Rua Padre Adelino, 1020 - Belenzinho, São Paulo",
    city: "São Paulo",
    lat: -23.5394,
    lng: -46.6015,
    hours: "Seg-Sex: 9h-18h",
    collection: "Acervo: 28.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Belmonte",
    address: "Rua Paulo Eiró, 525 - Santo Amaro, São Paulo",
    city: "São Paulo",
    lat: -23.6528,
    lng: -46.7089,
    hours: "Seg-Sex: 8h-18h",
    collection: "Acervo: 32.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Narbal Fontes",
    address: "Rua Siqueira Bueno, 1808 - Mooca, São Paulo",
    city: "São Paulo",
    lat: -23.5615,
    lng: -46.5952,
    hours: "Seg-Sex: 9h-19h",
    collection: "Acervo: 25.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  {
    name: "Biblioteca Prefeito Prestes Maia",
    address: "Rua da Mooca, 1921 - Mooca, São Paulo",
    city: "São Paulo",
    lat: -23.5589,
    lng: -46.5989,
    hours: "Seg-Sex: 9h-18h, Sáb: 9h-13h",
    collection: "Acervo: 30.000+ livros",
    link: "https://www.prefeitura.sp.gov.br/cidade/secretarias/cultura/bibliotecas/",
  },
  // Santos libraries
  {
    name: "Biblioteca Municipal de Santos",
    address: "Praça Mauá, s/n - Centro, Santos",
    city: "Santos",
    lat: -23.9395,
    lng: -46.3322,
    hours: "Seg-Sex: 9h-18h",
    collection: "Acervo: 50.000+ livros",
    link: "https://www.santos.sp.gov.br/",
  },
  {
    name: "Biblioteca Pública Infantil Alaíde Bueno",
    address: "Rua Silva Jardim, 840 - Vila Mathias, Santos",
    city: "Santos",
    lat: -23.9458,
    lng: -46.3289,
    hours: "Seg-Sex: 9h-17h",
    collection: "Especializada em literatura infantil",
    link: "https://www.santos.sp.gov.br/",
  },
  {
    name: "Biblioteca Pública Municipal Rubens Martins",
    address: "Av. Ana Costa, 340 - Gonzaga, Santos",
    city: "Santos",
    lat: -23.9665,
    lng: -46.3318,
    hours: "Seg-Sex: 9h-18h, Sáb: 9h-13h",
    collection: "Acervo: 35.000+ livros",
    link: "https://www.santos.sp.gov.br/",
  },
  {
    name: "Biblioteca Pública do Embaré",
    address: "Rua Euclides da Cunha, 11 - Embaré, Santos",
    city: "Santos",
    lat: -23.9712,
    lng: -46.3156,
    hours: "Seg-Sex: 9h-17h",
    collection: "Acervo: 20.000+ livros",
    link: "https://www.santos.sp.gov.br/",
  },
  {
    name: "Biblioteca Pública do Marapé",
    address: "Rua Oswaldo Cochrane, 211 - Marapé, Santos",
    city: "Santos",
    lat: -23.9523,
    lng: -46.3089,
    hours: "Seg-Sex: 9h-17h",
    collection: "Acervo: 18.000+ livros",
    link: "https://www.santos.sp.gov.br/",
  },
]

// Render library results without images
function renderLibraryResults(libraries) {
  const libraryGrid = document.querySelector(".library-grid")

  if (!libraryGrid) return

  if (libraries.length === 0) {
    libraryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <p style="font-size: 1.125rem; color: var(--color-text-secondary);">
          Nenhuma biblioteca encontrada nesta região.
        </p>
      </div>
    `
    return
  }

  libraryGrid.innerHTML = libraries
    .map(
      (library) => `
    <article class="library-card">
      <div class="library-content">
        <h3 class="library-name">${library.name}</h3>
        <p class="library-city">${library.city}</p>
        <p class="library-address">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          ${library.address}
        </p>
        <p class="library-distance">${library.distanceText}</p>
        <div class="library-info">
          <span class="info-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${library.hours}
          </span>
          <span class="info-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2"/>
              <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            ${library.collection}
          </span>
        </div>
        <a href="${library.link}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="library-link">
          Ver Detalhes
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  `,
    )
    .join("")
}

function searchLibraries(location) {
  console.log("[v0] Searching libraries for:", location)
  showLoading()

  // Simulate geocoding - in real app, use Google Maps Geocoding API or similar
  // For demo, we'll use São Paulo city center as default
  setTimeout(() => {
    // Default to São Paulo center coordinates
    const defaultLat = -23.5505
    const defaultLng = -46.6333

    searchLibrariesByCoords(defaultLat, defaultLng)
    hideLoading()
    showNotification(`Mostrando bibliotecas próximas a: ${location}`)
  }, 1000)
}

function searchLibrariesByCoords(lat, lng) {
  console.log("[v0] Searching libraries by coordinates:", lat, lng)
  showLoading()

  setTimeout(() => {
    // Calculate distance for each library
    const librariesWithDistance = librariesDatabase.map((library) => {
      const distance = calculateDistance(lat, lng, library.lat, library.lng)
      return {
        ...library,
        distance: distance,
        distanceText:
          distance < 1
            ? `${Math.round(distance * 1000)} metros de distância`
            : `Aproximadamente ${distance.toFixed(1)} km de distância`,
      }
    })

    // Sort by distance (closest first)
    librariesWithDistance.sort((a, b) => a.distance - b.distance)

    // Show only the 6 closest libraries
    const nearestLibraries = librariesWithDistance.slice(0, 6)

    // Update results title
    const resultsTitle = document.querySelector(".results-title")
    if (resultsTitle) {
      resultsTitle.textContent = `Bibliotecas Mais Próximas (${nearestLibraries.length} encontradas)`
    }

    // Render results
    renderLibraryResults(nearestLibraries)

    hideLoading()
    showNotification(`${nearestLibraries.length} bibliotecas encontradas próximas à sua localização`)

    // Announce to screen readers
    announceToScreenReader(`${nearestLibraries.length} bibliotecas encontradas e ordenadas por proximidade`)
  }, 1500)
}

function showLoading() {
  if (libraryLoading) {
    libraryLoading.style.display = "block"
  }
  if (libraryResults) {
    libraryResults.style.opacity = "0.5"
  }
}

function hideLoading() {
  if (libraryLoading) {
    libraryLoading.style.display = "none"
  }
  if (libraryResults) {
    libraryResults.style.opacity = "1"
  }
}

// Function to create review card HTML
function createReviewCard(data) {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => {
      const filled = i < data.rating ? "filled" : ""
      return `<span class="star ${filled}">★</span>`
    })
    .join("")

  const critiqueSection = data.critique
    ? `
    <details class="critique-details">
      <summary>Ver Crítica Literária</summary>
      <div class="critique-content">
        <p>${escapeHtml(data.critique)}</p>
      </div>
    </details>
  `
    : ""

  return `
    <article class="review-card" style="animation: slideIn 0.5s ease;">
      <div class="review-header">
        <div class="review-book-info">
          <h4 class="book-title">${escapeHtml(data.bookTitle)}</h4>
          <p class="book-author">${escapeHtml(data.bookAuthor)}</p>
        </div>
        <div class="review-rating" aria-label="Avaliação: ${data.rating} de 5 estrelas">
          ${stars}
        </div>
      </div>
      <div class="review-content">
        <p class="review-text">${escapeHtml(data.reviewText)}</p>
        ${critiqueSection}
      </div>
      <div class="review-footer">
        <span class="reviewer-name">${escapeHtml(data.reviewerName)}</span>
        <span class="review-date">${data.date}</span>
      </div>
    </article>
  `
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Notification function
function showNotification(message) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--color-primary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add animation keyframes
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`
document.head.appendChild(style)

// Accessibility Features - Improved Implementation
const accessibilityFeatures = {
  fontSize: "normal",
  dyslexiaFont: false,
  lineHeight: false,
  focusHighlight: true,
  reducedMotion: false,
}

// Initialize accessibility on DOM load
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Initializing accessibility features...")
  detectSystemPreferences()
  loadAccessibilityPreferences()
  setupAccessibilityControls()
  console.log("[v0] Accessibility features initialized successfully")
})

// Load saved preferences
function loadAccessibilityPreferences() {
  try {
    const saved = localStorage.getItem("accessibilityPreferences")
    if (saved) {
      const savedPrefs = JSON.parse(saved)
      Object.assign(accessibilityFeatures, savedPrefs)
      console.log("[v0] Loaded saved preferences:", accessibilityFeatures)
    }
    applyAccessibilitySettings()
  } catch (error) {
    console.error("[v0] Error loading accessibility preferences:", error)
  }
}

// Save preferences
function saveAccessibilityPreferences() {
  try {
    localStorage.setItem("accessibilityPreferences", JSON.stringify(accessibilityFeatures))
    console.log("[v0] Saved preferences:", accessibilityFeatures)
  } catch (error) {
    console.error("[v0] Error saving accessibility preferences:", error)
  }
}

// Apply all accessibility settings
function applyAccessibilitySettings() {
  console.log("[v0] Applying accessibility settings:", accessibilityFeatures)

  // Font size
  document.body.classList.remove("font-size-small", "font-size-large")
  if (accessibilityFeatures.fontSize === "small") {
    document.body.classList.add("font-size-small")
  } else if (accessibilityFeatures.fontSize === "large") {
    document.body.classList.add("font-size-large")
  }

  // Update font size buttons
  updateButtonStates()

  // Dyslexia font
  document.body.classList.toggle("dyslexia-font", accessibilityFeatures.dyslexiaFont)
  updateToggleState("dyslexiaFontToggle", "dyslexiaStatus", accessibilityFeatures.dyslexiaFont, "Ativado", "Desativado")

  // Line height
  document.body.classList.toggle("increased-line-height", accessibilityFeatures.lineHeight)
  updateToggleState("lineHeightToggle", "lineHeightStatus", accessibilityFeatures.lineHeight, "Aumentado", "Normal")

  // Focus highlight
  document.body.classList.toggle("enhanced-focus", accessibilityFeatures.focusHighlight)
  updateToggleState(
    "focusHighlightToggle",
    "focusStatus",
    accessibilityFeatures.focusHighlight,
    "Ativado",
    "Desativado",
  )

  // Reduced motion
  document.body.classList.toggle("reduced-motion", accessibilityFeatures.reducedMotion)
  updateToggleState(
    "animationsToggle",
    "animationsStatus",
    accessibilityFeatures.reducedMotion,
    "Reduzidas",
    "Ativadas",
  )
}

// Update button states for font size
function updateButtonStates() {
  const decreaseBtn = document.getElementById("decreaseFontBtn")
  const normalBtn = document.getElementById("normalFontBtn")
  const increaseBtn = document.getElementById("increaseFontBtn")

  if (decreaseBtn && normalBtn && increaseBtn) {
    decreaseBtn.classList.remove("active")
    normalBtn.classList.remove("active")
    increaseBtn.classList.remove("active")

    if (accessibilityFeatures.fontSize === "small") {
      decreaseBtn.classList.add("active")
    } else if (accessibilityFeatures.fontSize === "large") {
      increaseBtn.classList.add("active")
    } else {
      normalBtn.classList.add("active")
    }
  }
}

// Update toggle state
function updateToggleState(toggleId, statusId, isChecked, activeText, inactiveText) {
  const toggle = document.getElementById(toggleId)
  const status = document.getElementById(statusId)

  if (toggle) {
    toggle.checked = isChecked
  }
  if (status) {
    status.textContent = isChecked ? activeText : inactiveText
  }
}

// Setup all accessibility controls
function setupAccessibilityControls() {
  // Font size controls
  const decreaseFontBtn = document.getElementById("decreaseFontBtn")
  const normalFontBtn = document.getElementById("normalFontBtn")
  const increaseFontBtn = document.getElementById("increaseFontBtn")

  if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener("click", () => {
      console.log("[v0] Decreasing font size")
      accessibilityFeatures.fontSize = "small"
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification("Tamanho do texto reduzido")
    })
  }

  if (normalFontBtn) {
    normalFontBtn.addEventListener("click", () => {
      console.log("[v0] Setting normal font size")
      accessibilityFeatures.fontSize = "normal"
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification("Tamanho do texto normal")
    })
  }

  if (increaseFontBtn) {
    increaseFontBtn.addEventListener("click", () => {
      console.log("[v0] Increasing font size")
      accessibilityFeatures.fontSize = "large"
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification("Tamanho do texto aumentado")
    })
  }

  // Dyslexia font toggle
  const dyslexiaFontToggle = document.getElementById("dyslexiaFontToggle")
  if (dyslexiaFontToggle) {
    dyslexiaFontToggle.addEventListener("change", (e) => {
      console.log("[v0] Toggling dyslexia font:", e.target.checked)
      accessibilityFeatures.dyslexiaFont = e.target.checked
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification(e.target.checked ? "Fonte para dislexia ativada" : "Fonte padrão restaurada")
    })
  }

  // Line height toggle
  const lineHeightToggle = document.getElementById("lineHeightToggle")
  if (lineHeightToggle) {
    lineHeightToggle.addEventListener("change", (e) => {
      console.log("[v0] Toggling line height:", e.target.checked)
      accessibilityFeatures.lineHeight = e.target.checked
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification(e.target.checked ? "Espaçamento aumentado" : "Espaçamento normal")
    })
  }

  // Focus highlight toggle
  const focusHighlightToggle = document.getElementById("focusHighlightToggle")
  if (focusHighlightToggle) {
    focusHighlightToggle.addEventListener("change", (e) => {
      console.log("[v0] Toggling focus highlight:", e.target.checked)
      accessibilityFeatures.focusHighlight = e.target.checked
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification(e.target.checked ? "Destaque de foco ativado" : "Destaque de foco desativado")
    })
  }

  // Animations toggle
  const animationsToggle = document.getElementById("animationsToggle")
  if (animationsToggle) {
    animationsToggle.addEventListener("change", (e) => {
      console.log("[v0] Toggling animations:", e.target.checked)
      accessibilityFeatures.reducedMotion = e.target.checked
      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification(e.target.checked ? "Animações reduzidas" : "Animações ativadas")
    })
  }

  // Reset accessibility settings
  const resetAccessibilityBtn = document.getElementById("resetAccessibilityBtn")
  if (resetAccessibilityBtn) {
    resetAccessibilityBtn.addEventListener("click", () => {
      console.log("[v0] Resetting accessibility settings")
      accessibilityFeatures.fontSize = "normal"
      accessibilityFeatures.dyslexiaFont = false
      accessibilityFeatures.lineHeight = false
      accessibilityFeatures.focusHighlight = true
      accessibilityFeatures.reducedMotion = false

      applyAccessibilitySettings()
      saveAccessibilityPreferences()
      showNotification("Configurações de acessibilidade restauradas")
    })
  }
}

// Detect system preferences
function detectSystemPreferences() {
  // Check for prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    accessibilityFeatures.reducedMotion = true
    console.log("[v0] System prefers reduced motion detected")
  }
}

// Announce page changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement("div")
  announcement.setAttribute("role", "status")
  announcement.setAttribute("aria-live", "polite")
  announcement.className = "sr-only"
  announcement.textContent = message
  document.body.appendChild(announcement)

  setTimeout(() => announcement.remove(), 1000)
}

// Add ARIA live region for dynamic content updates
const liveRegion = document.createElement("div")
liveRegion.setAttribute("aria-live", "polite")
liveRegion.setAttribute("aria-atomic", "true")
liveRegion.className = "sr-only"
document.body.appendChild(liveRegion)

// Update notification function to announce to screen readers
const originalShowNotification = showNotification
showNotification = (message) => {
  originalShowNotification(message)
  announceToScreenReader(message)
}

console.log("[v0] BookToRead initialized successfully")
console.log("[v0] Book review functionality initialized")
console.log("[v0] Library finder functionality initialized")
console.log("[v0] Spotify music player initialized")

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}
