const queue = require('../config/kue');
const commentMailer = require('../mailers/commentMailer');

// *********** Create memory queue to store emails which will be send when its turn comes **********
queue.process('emails', function(job, done){
    console.log('Email worker is processing the job', job.data);
    commentMailer.newComment(job.data);
    done();
})