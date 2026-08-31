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
}

export default new DonationApi();
