/**
 * Maintenance Suite Card Animation Delays
 * Handles staggered fade-ins and specular glass shine sweeps.
 */
document.addEventListener("DOMContentLoaded", () => {
    const fadeStart = 0.15;
    const fadeStep = 0.10;

    const shineStart = 1.50;
    const shineStep = 0.35;

    document.querySelectorAll('.tool-card').forEach((card, index) => {
        card.style.animationDelay = `${fadeStart + index * fadeStep}s`;
        card.style.setProperty(
            '--shine-delay',
            `${shineStart + index * shineStep}s`
        );
    });
});
