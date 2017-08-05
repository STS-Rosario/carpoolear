<template>
    <div class="rate-item">
        <div class="row">
            <div class="col-xs-24 col-sm-12 col-md-8">
                <div class="image-width">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="rate.from.image"></div>
                </div>
                <div class="text-width">
                    <div class="rate-item-title">
                        <div>
                            <strong>{{rate.from.name}}</strong>
                            <span class="rate-item-value">
                                <i class="fa fa-thumbs-up" aria-hidden="true" v-if="rate.rating == 1"></i>
                                <i class="fa fa-thumbs-down" aria-hidden="true" v-if="rate.rating == 0"></i>
                            </span>
                            <span class="pull-right clickeable" v-if="!rate.reply_comment && user.id === id" @click="showReply = !showReply">
                                <i class="fa fa-reply" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div class="rate-item-detail" v-if="rate.trip.points.length > 0">
                            Viajó a {{rate.trip.points[rate.trip.points.length - 1].json_address.ciudad}} como {{rateType}}
                             - {{rate.rate_at | moment("DD/MM/YYYY")}}
                        </div>
                        <div class="rate-item-detail" v-else>
                            Viajó a {{ rate.trip.to_town }} como {{rateType}}
                             - {{rate.rate_at | moment("DD/MM/YYYY")}}
                        </div>
                    </div>
                    <div class="rate-item-comment">
                        {{rate.comment}}
                    </div>
                    <div class="rate-item-datetime">

                    </div>
                    <div v-if="showReply">
                        <textarea v-model="comment"></textarea>
                        <button class="btn btn-primary" @click="onReply"> Responder </button>
                        <button class="btn btn-primary" @click="onCancelReply"> Cancelar </button>
                    </div>
                    <div class="reply_comment_content" v-if="rate.reply_comment">
                        <div class="reply_comment">
                            {{rate.reply_comment}}
                        </div>
                        <div class="reply_comment_date">
                            {{rate.reply_comment_created_at | moment("calendar")}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import moment from 'moment';
export default {
    data () {
        return {
            showReply: false,
            comment: ''
        };
    },
    methods: {
        ...mapActions({
            'reply': 'rates/reply'
        }),
        onReply () {
            let data = {
                trip_id: this.rate.trip.id,
                user_id: this.rate.from.id,
                comment: this.comment
            };
            this.reply(data).then(() => {
                this.showReply = false;
                this.rate.reply_comment = this.comment;
                this.rate.reply_comment_created_at = moment(new Date()).format();
                this.comment = '';
            });
        },
        onCancelReply () {
            this.comment = '';
            this.showReply = false;
        }
    },
    computed: {
        rateType () {
            return this.rate.user_to_type === 0 ? 'pasajero' : 'conductor';
        }
    },
    props: [
        'user',
        'rate',
        'id'
    ]
};
</script>
