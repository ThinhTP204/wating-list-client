Okay, here's a Project PRD (Product Requirements Document) brief for the Wokki app's Light Mode theme implementation, based on your conversation.

---

## Project Brief: Wokki App Light Mode Theme Implementation

**Project Title:** Project Lumina: Wokki Light Theme Redesign
**Version:** 1.0
**Date:** October 26, 2023
**Author:** Product Manager

---

### 1. Executive Summary

This project aims to introduce a comprehensive Light Mode theme for the Wokki employee workforce management application. This initiative will convert key screens from their existing dark aesthetic to a clean, bright, and highly readable light interface. The goal is to enhance user preference, improve accessibility, and provide a fresh, modern look while maintaining Wokki's unique "gaming and strategic command center" feel.

### 2. Problem Statement

The current Wokki app primarily features a dark theme. While popular, a dark-only theme may not suit all user preferences, environmental lighting conditions, or accessibility needs, potentially leading to user fatigue or reduced readability for some. Offering a light mode provides users with choice and improves overall usability.

### 3. Goals & Objectives

*   **Primary Goal:** Successfully implement a cohesive Light Mode theme across specified core screens of the Wokki app.
*   **Objectives:**
    *   **Enhance Readability:** Improve text and data visibility, reducing eye strain in well-lit environments.
    *   **Improve User Comfort:** Offer a preferred visual experience for users who prefer lighter interfaces.
    *   **Maintain Brand Identity:** Ensure Wokki's established primary blue colors and vibrant accents are retained and optimized for the light theme.
    *   **Modern Aesthetic:** Adopt a clean, contemporary UI with light glassmorphism effects.
    *   **Consistency:** Ensure a uniform and intuitive user experience across all light-themed screens.

### 4. Target Audience

All Wokki employee workforce management app users.

### 5. Scope

**5.1. In-Scope:**

*   **Theme Conversion:** Redesign and implement the Light Mode theme for the following screens:
    *   **Command Center**
    *   **Incentive Engine**
    *   **Smart Matching & Noti**
    *   **My Schedule**
*   **Core Design Elements:**
    *   Definition and application of a new light color palette.
    *   Implementation of light glassmorphism effects for cards and panels.
    *   Adjustments to typography for high contrast and readability on light backgrounds.
    *   Optimization of existing vibrant elements (e.g., reward wheel, karma indicators, tags) for contrast within the light theme.
    *   Integration of brand primary blues (#1D4D8F, #4C88C6, #BCE8F5) as accent colors.

**5.2. Out-of-Scope (for this initial phase):**

*   Development of a user-facing Dark/Light Mode toggle switch (initial implementation will be a conversion to light mode).
*   Changes to font families.
*   Exploration of alternative primary accent colors (e.g., green).
*   Conversion of any screens or features not explicitly listed above.

### 6. Functional Requirements (Theme-Specific)

*   **FR1:** The specified screens shall display content using the new Light Mode theme.

### 7. Non-Functional Requirements

*   **NFR1 - Usability:** The Light Mode theme shall significantly improve content readability and reduce eye strain for users preferring a lighter interface.
*   **NFR2 - Performance:** The theme implementation shall not negatively impact application loading times or overall performance.
*   **NFR3 - Consistency:** The Light Mode design language shall be consistently applied across all in-scope screens.
*   **NFR4 - Accessibility:** The chosen color palette and typography in Light Mode must adhere to WCAG (Web Content Accessibility Guidelines) for contrast ratios to ensure content is accessible to users with visual impairments.
*   **NFR5 - Maintainability:** The theme should be implemented in a modular and easily maintainable way, ideally using design tokens or a similar system.

### 8. Design Details & Requirements

The Light Mode theme will embody a clean, crisp, and modern aesthetic, retaining the "gaming and strategic command center" feel where appropriate.

**8.1. General Principles:**

*   **Backgrounds:** Predominantly clean white and light gray palette; soft off-white or light gray.
*   **Glassmorphism:** Utilize light glassmorphism effects (semi-transparent white cards with subtle shadows and soft blurs) for primary content containers.
*   **Text:** Transition from light/white text to dark slate/black text for maximum readability and clarity.
*   **Primary Blues:** Retain corporate blue (#1D4D8F, #4C88C6) and light blue (#BCE8F5) for accents, interactive elements, buttons, and key data visualizations.
*   **Vibrant Elements:** Existing neon/vibrant elements (e.g., Reward Wheel, tags, progress rings) must be adjusted for contrast to pop effectively against the lighter backgrounds.

**8.2. Screen-Specific Details:**

*   **Command Center Light Mode:**
    *   Transform existing dark theme to a light theme.
    *   Use a clean, crisp white and light gray background palette.
    *   Replace the Slate 900 backgrounds with light glassmorphism effects (semi-transparent white cards with subtle shadows).
    *   Text should transition from light/white to dark slate/black for high readability.
    *   Maintain the neon/vibrant accents but ensure they pop against the light background.
*   **Incentive Engine Light Mode:**
    *   Convert 'The Incentive Engine' to a light theme.
    *   The dark navy background should become a soft off-white or light gray.
    *   Use glassmorphism cards with white backgrounds and soft blurs.
    *   The 'Reward Wheel' and vibrant tags should remain colorful but adjusted for contrast against light surfaces.
    *   Keep the primary interaction buttons in the corporate blue (#4C88C6) or light blue (#BCE8F5) where appropriate.
    *   Text should be dark for clarity.
*   **Smart Matching Light Mode:**
    *   Switch the 'Smart Matching & Noti' screen to a light theme.
    *   Backgrounds should be light and airy.
    *   The glassmorphism cards should have a frosty white appearance.
    *   Highlight 'Karma' and 'Match' scores using the established blue and accent palette, but optimized for a light UI.
    *   Ensure all notifications and buttons have high contrast with dark text.
*   **Schedule Light Mode:**
    *   Redesign the 'My Schedule' screen in light mode.
    *   Transition from the dark theme to a white/light-gray layout.
    *   Calendar cards should be white with subtle borders and shadows.
    *   The progress rings and 'Karma' indicators should use the brand blues against the light background.
    *   Navigation and sidebar should also reflect this clean, bright aesthetic.

### 9. Success Metrics

*   Successful deployment of the Light Mode theme across all in-scope screens.
*   Adherence to all specified design requirements and brand guidelines.
*   Positive qualitative feedback from user testing and initial user reviews regarding readability and aesthetic appeal of the Light Mode.
*   Meeting WCAG contrast ratio standards for all text and interactive elements.

### 10. Future Considerations (Out-of-Scope for V1)

*   **Theme Toggle:** Implement a user-controlled toggle (e.g., in Settings) to allow users to switch between Dark and Light Mode dynamically.
*   **Accent Color Options:** Explore offering alternative accent colors (e.g., green for a fresh feel) in addition to the primary blue.
*   **Typography Refinement:** Review and potentially increase bolding for main titles and key information in the Light Mode for enhanced visual hierarchy.
*   **Full App Coverage:** Extend Light Mode implementation to all remaining screens of the Wokki application.

---