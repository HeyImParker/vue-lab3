Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: '#app',
    data: {
        number: '',
        max: '',
        loading: true,
        addedName: '',
        addedComment: '',
        comments: {},
        ratings: {},
        current: {
            title: '',
            img: '',
            alt: ''
        },
    },
    created() {
      this.xkcd();
    },
    methods: {
        xkcd() {
            this.loading = true;
            let url = 'https://xkcd.now.sh/?comic=';
            if (this.number === '') {
                url += 'latest';
            } else {
                url += this.number;
            }
            axios.get(url)
                .then(response => {
                    this.current = response.data;
                    this.loading = false;
                    this.number = response.data.num;
                    return true;
            })
            .catch(error => {
                this.number = this.max;
                console.log(error)
            });
        },
        previousComic() {
            this.number = this.current.num - 1;
            if (this.number < 1)
                this.number = 1;
        },
        nextComic() {
            this.number = this.current.num + 1;
            if (this.number > this.max)
                this.number = this.max
        },
        firstComic() {
            this.number = 1;
        },
        lastComic() {
            this.number = this.max;
        },
        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
        },
        randomComic() {
            this.number = this.getRandom(1, this.max);
        },
        addComment() {
            if (!(this.number in this.comments))
                Vue.set(app.comments, this.number, new Array);
            let now = new Date();
            let dateString = now.getHours() + ":" + now.getMinutes();
            dateString += " - " + (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear();
            delete now;
            this.comments[this.number].push({
                author: this.addedName,
                text: this.addedComment,
                date: dateString,
            });
            this.addedName = '';
            this.addedComment = '';
        },
        setRating(rating){
            if (!(this.number in this.ratings))
            Vue.set(this.ratings, this.number, {
                sum: 0,
                total: 0
            });
            this.ratings[this.number].sum += rating;
            this.ratings[this.number].total += 1;
            },
        },
    computed: {
        month() {
            var month = new Array;
            if (this.current.month === undefined)
                return '';
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            return month[this.current.month - 1];
        },
        averageRating() {
            if(!(this.number in this.ratings) || this.ratings[this.number].total == 0) {
                return "Be the first to rate this comic";
            }
            return "Average Rating: " + (Math.round((this.ratings[this.number].sum / this.ratings[this.number].total) * 10) / 10);
        }
    },
    watch: {
        number(value, oldvalue) {
            if (oldvalue === '') {
                this.max = value;
            } else {
                this.xkcd();
            }
        },
    },
  });