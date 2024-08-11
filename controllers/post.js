const postModel = require('../models/post');


let postSample = [
    { _id: "1", title: 'First Post', content: 'Lorem impsum' },
    { _id: "2", title: 'Second Post', content: 'quid amet' },
    { _id: "3", title: 'Third Post', content: 'Texto falso' }
  ];

exports.getPosts = async (req, res, next) => {
    const posts = await postModel.find();
    res.json({ message: 'Posts fetched successfully!', posts });
};


exports.postPosts = async (req, res, next) => {
    try {
        // Verifica si el CSRF Token está presente
        const csrfToken = req.headers['x-csrf-token'];
        if (!csrfToken) {
            return res.status(400).json({ error: 'CSRF Token is missing' });
        }
        console.log('Received CSRF Token:', csrfToken);

        // Verifica si el cuerpo de la solicitud contiene 'title' y 'content'
        if (!req.body || !req.body.title || !req.body.content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        console.log('Request Body:', req.body);
        const { title, content } = req.body;


        // Crea un nuevo post y lo agrega a la lista de posts
        const newPost = new postModel({ title, content });
        newPost.save();
        res.status(201).json({ message: 'Post added successfully!', post: newPost });

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}


exports.deletePost = async (req, res, next) => {
    console.log('DELETE request received for postId en la API:', req.params.postId);
    try {
        const postId = req.params.postId;
        const deletedPost = await postModel.findByIdAndDelete(postId);
        res.status(200).json({ message: `Post ${deletedPost} deleted successfully!` });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

exports.putPost = async (req, res, next) => {
    console.log('ACTUALIZANDO EN EL BACKEND:', req.params.postId);
    try {
        if (!req.body || !req.body.title || !req.body.content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        
        let updatedData = { 
            title: req.body.title, 
            content: req.body.content 
        };

        const updatedPost = await postModel.findByIdAndUpdate(req.params.postId, updatedData, { new: true });
        console.log('Updated Post:', updatedPost);
        res.status(200).json({ message: 'Post updated successfully!',updatedPost });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
}};