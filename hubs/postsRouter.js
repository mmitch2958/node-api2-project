const express = require("express")
const method = require('../data/db')
const router = express.Router();

router.get("/", (req, res) => {
  method.find(req.query)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(() => res.status(500).json({ errorMessage: "The posts information could not be retrieved." }))
})

router.post("/", (req, res) => {
  if(req.body.title == "" || req.body.contents == "") {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    method.insert(req.body)
    .then(resp => {
      req.body.id = resp.id
      res.status(201).json(req.body)
    })
    .catch(() => res.status(500).json({ errorMessage: "There was an error while saving the post to the database" }))
  }
})

router.get("/:id", (req, res) => {
  method.findById(req.params.id)
  .then(message => {
    if(message.length > 0) {
      res.status(200).json(message)
    } else {
      res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "The post information could not be retrieved." })
  })
})

router.put("/:id", (req, res) => {
  const changes = req.body,
  id = req.params.id

  if(changes.title == "" || changes.contents == "") {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    method.update(id, changes)
    .then(change => {
      if(change) {
        method.findById(id)
        .then(post => {
          res.status(200).json(post)
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ errorMessage: "The post information could not be modified." })
        })
      } else {
        res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: "The post information could not be modified." })
    })
  }
})

router.delete("/:id", (req, res) => {
  method.remove(req.params.id)
  .then(count => {
    if (count) {
      res.status(200).json({ successMessage: "Post deleted." })
    } else {
      res.status(404).json({ errorMessage: "The post with the specified ID does not exist."})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "Cannot remove post at this time. "})
  })
})

router.get("/:id/comments", (req, res) => {
  method.findById(req.params.id)
  .then(response => {
    if(response.length > 0) {
      method.findPostComments(req.params.id)
      .then(comments => res.status(200).json(comments))
      .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
      })
    } else {
      res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
    }
  })
})

router.post("/:id/comments", (req, res) => {
  if(req.body.text !== "") {
    method.findCommentById(req.params.id)
    .then(comment => {
      console.log(comment)
      req.body.post_id = req.params.id

      if(comment.length === 1) {
        method.insertComment(req.body)
        .then(i => {
          res.status(201).json({ successMessage: "Successfully inserted comment", data: req.body })
        })
        .catch(() => res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"}))
      }
    })
    .catch(() => res.status(500).json({ errorMessage: "Something went wrong adding the comment."}))
  } else {
    res.status(400).json({ errorMessage: "Please provide text for the comment."})
  }

  //   if(req.body.text != "") {
  //     method.insertComment(req.body)
  //     .then(() => {
  //       res.status(201).json({ successMessage: "Successfully inserted comment" })
  //     })
  //     .catch(() => res.status(500).json({ errorMessage: "Something went wrong adding the comment."}))

  //   } else {
  //     res.status(400).json({ errorMessage: "Please provide text for the comment."})
  //   }
  // } else {
  //   res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
  // }
})

// get     /api/posts                 x
// post    /api/posts                 x
// get     /api/posts/:id             x

// put     /api/posts/:id             x

// delete  /api/posts/:id             x

// get     /api/posts/:id/comments    x
// post    /api/posts/:id/comments    x

module.exports = router