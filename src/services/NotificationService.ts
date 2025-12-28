export const NotificationService = {
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications.');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    async sendNotification(title: string, options?: NotificationOptions) {
        if (Notification.permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            if (registration.showNotification) {
                // Using service worker registration for better PWA support
                registration.showNotification(title, {
                    icon: '/favicon.png',
                    badge: '/favicon.png', // Small icon for status bar
                    ...options
                });
            } else {
                new Notification(title, options);
            }
        }
    },

    // Logical triggers
    checkFastingStatus(status: 'FASTING' | 'FEEDING', remainingHours: number) {
        if (status === 'FASTING' && remainingHours === 0) {
            this.sendNotification('Fast Completed', {
                body: 'Your fasting window has ended. You can now begin your feeding period.',
                tag: 'fast-end'
            });
        }
    },

    checkAutophagy(hoursElapsed: number) {
        // Trigger exactly once when hitting 14 hours
        if (Math.floor(hoursElapsed) === 14) {
            this.sendNotification('Autophagy Active', {
                body: 'Your body has reached the stage of cellular repair (14+ hours fasting).',
                tag: 'autophagy'
            });
        }
    },

    remindHydration(currentCount: number) {
        if (currentCount < 8) {
            const remaining = 8 - currentCount;
            this.sendNotification('Hydration Update', {
                body: `You have consumed ${(currentCount * 0.5).toFixed(1)}L. ${remaining} glasses remaining for your 4L goal.`,
                tag: 'hydration-reminder'
            });
        }
    }
};
