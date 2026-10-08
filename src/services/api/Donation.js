import TaggedApi from '../../classes/TaggedApi';

class DonationApi extends TaggedApi {
    getTiers() {
        return this.get('/api/donation-tiers', {});
    }

    checkoutOnce(data) {
        return this.post('/api/donations/checkout/once', data);
    }

    checkoutMonthly(data) {
        return this.post('/api/donations/checkout/monthly', data);
    }

    checkoutQrOrder(data) {
        return this.post('/api/donations/checkout/qr-order', data);
    }

    markWelcomeShown() {
        return this.post('/api/club-carpoolear/welcome-shown', {});
    }
}

export default new DonationApi();
