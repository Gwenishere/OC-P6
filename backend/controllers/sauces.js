// work logic
const Sauces = require('../models/sauces');

const fs = require('fs');

// middleware create
exports.createSauce = (req, res, next) => {
 const sauceObject = JSON.parse(req.body.sauce);
  let sauce = new Sauces({
   ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
 });
 sauce.save()
 .then(() => 
 res.status(201).json({ message: 'Sauce created!'}))
 .catch(error => res.status(400).json({ error }));
};

/**FIXME:
 * que fait ont de req.body.heat et .name ?
 */

// middleware modify sauce
exports.modifySauce = (req, res, next) => { 
    const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    /* cancel oldest pic if new uploaded */
    if (req.file) {
      // search sauce with ID in data base 
      Sauces.findOne({ _id: req.params.id })
      .then( sauce => {
        // get pic path and erase in server
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            // error msg if erase without success 
            console.log('failed to delete local image:' + err);
          }
          });
      })
      // error msg if can't get sauce & modify
      .catch(error => res.status(500).json({ error }));
    }
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
    .then(() => res.status(200).json({ message: 'Sauce modified!'}))
    .catch(error => res.status(400).json({ error }));
};

// middleware delete
exports.deleteSauce =  (req, res, next) => {
    Sauces.findOne({ _id: req.params.id  })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id }) 
        .then(() => res.status(200).json({ message: 'Sauce deleted!'}))
        .catch(error => res.status(400).json({ error }));
      }).catch(error => res.status(500).json({ error }));
    });
  };

// middleware get one sauce
exports.getOneSauce = (req, res, next) => { 
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// middleware get all sauces
exports.getAllSauces = (req, res, next) => { 
  Sauces.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};
/**FIXME:
// like and dislike sauce
les mêmes users
les cas 0
*/
// middleware like or dislike sauce
exports.likeSauce = (req, res, next) => {
  // search sauce in data base
  Sauces.findOne({ _id: req.params.id})
  .then( sauce => {
    // use a switch statement. req.body.like is an option
    switch (req.body.like) {
      /* user dislike : Statements executed when the result matches value -1 */
      case -1:
        /* vote dislike sauce, add 1 dislike */
        sauce.dislikes++;
        /* add user ID to array userDisliked */
        sauce.usersDisliked.push(req.body.userId);
        // If userId already in array userLiked > reduce like or dislike in array
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes--;
          let index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(index, 1);
        }
      break;
      /* user cancel like or dislike: Statements executed when the result matches value 0 */
      case 0:
      /* cancel vote: erase userId in array where it is & reduce like or dislike if ID is there or not in array*/
      if (sauce.usersLiked.includes(req.body.userId)) {
        sauce.likes--;
        let index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(index, 1);
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        sauce.dislikes--;
        let index = sauce.usersDisliked.indexOf(req.body.userId);
        sauce.usersDisliked.splice(index, 1);
      }
      break;
      /* user like : Statements executed when the result matches value 1 */
      case 1:
        /* like: add likes & add userId in array usersLiked*/
        sauce.likes++;
        // add userId in array userLiked with push
        sauce.usersLiked.push(req.body.userId);
        // If userId already in array userLiked > reduce like or dislike in array
        if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes--;
          let index = sauce.usersDisliked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(index, 1);
        }
      break;
      // Statements executed when none of the values match the value of the expression 
      default:
        res.status(404).json({ message: "Error : not a like nor a dislike!" });
        console.log(`Sorry, like not taken.`)
        return;
    }
  // Number of likes/dislikes & arrays of like/dislike must be updated for functionnality
  Sauces.updateOne({ _id: req.params.id}, {likes: sauce.likes, dislikes: sauce.dislikes, usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Ok, voted!'}))
  .catch(error => res.status(400).json({ error }))
 })
.catch(error => res.status(400).json({ error }));
};