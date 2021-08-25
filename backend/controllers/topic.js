// Imports

const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require ('../models/index');

const User = db.User;
const Topic = db.Topic;

// Permet de créer un message sur le fil d'actualité de la messagerie

exports.post = (req, res, next) => {

    const userId = req.body.user_id
    console.log(req.file.path);

    User.findOne({attributes: ['id'], where: {id: userId}})
    .then(user => {
        if (user == null) {
            return res.status(400).json({ error: 'Utilisateur non trouvé !'});
        }
    })
    .catch(error => res.status(500).json({error}));

    const topic = Topic.create({
        user_id: userId,
        title: req.body.title,
        content: req.body.content,
        image: req.file.filename && req.file !== null ? `/public/uploads/post/${req.file.filename}`: null,
        video: req.body.video,
        likes: 0
    })
    .then(topic => res.status(201).json(topic))
    .catch(error => res.status(501).json({error}));
    };

// Permet d'afficher tout les messages créés

exports.getAll = (req, res, next) => {
    Topic.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .then(topic => res.status(200).json(topic))
    .catch(() => res.status(400).json({error}));
};

// Permet de modifier un message que l'on avait créé

exports.modify = (req, res, next) => {

    const topicId = req.params.topicId

    Topic.update({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image && req.file ? `${req.protocol}://${req.get('host')}/images/topic/${req.file.filename}`: null,
    },
    {attributes: ['id'],where: {id: topicId}})
    .then(() => res.status(200).json({message: "Modifications enregistrées !"}))
    .catch((error) => res.status(500).json({error}));  
};

// Permet de supprimer un message que l'on avait posté

exports.delete = (req, res, next) => {
    const topicId = req.params.topicId;
    
    Topic.findOne({where: {id: topicId}})
    .then(topic => {
      if(topic.image !== null){
        const filename = topic.image.split('/images/')[1]
        fs.unlink(`images/topic/${filename}`, () => {
        Topic.destroy({attributes:['id'], where: {id: topicId}})
          .then(() => res.status(200).json({message: "Message supprimé !"}))
          .catch((error) => res.status(402).json({error}))
      })
      } else {
        Topic.destroy({attributes:['id'], where: {id: topicId}})
          .then(() => res.status(200).json({message: "Message supprimé !"}))
          .catch((error) => res.status(401).json({error}))
      }
    })
    .catch(error => res.status(400).json({error}));
};

//LikeOrUnlike

exports.likeOrUnlike = (req, res) => {
    const likeStatus = req.body.likes;
    const userId = req.body.id;
    const thisTopic = req.params.id;

    Topic.findOne({where: {id: thisTopic}})
    .then(topic => {
        const userVote = topic.likes.indexOf(userId);

        if(likeStatus === 1){
            console.log(userId + "aime le post");
            Topic.updateOne(
                {id: thisTopic},
                {$push: {likes: userId}}
            )
            .then(() => res.status(200).json({message: "Vous aimez ce post"}))
            .catch((err) => res.status(400).json({err}))
        }

        if(likeStatus === 0 && userVote > -1){
            topic.likes.slice(userVote, 1);
            Topic.updateOne(
                {id: thisTopic},
                {$push: {likes: {$each: [], $slice: userVote}}}
            )
            .then(() => res.status(200).json({message: "Vous retirez votre like"}))
            .catch((err) => res.status(400).json({err}))
        }
    })



}