import {Post, IPostModel} from '../models/post';

const logger = require('../winston');

module.exports.getPostById = (id: string, callback: (err: any, post?: IPostModel) => {}) => {
    Post.findOne({_id: id}, (err, post) => {
        if (err)
            callback(err);
        else
            callback(null, post);
    });
};

module.exports.getPosts = (callback: (err: any, posts?: IPostModel[]) => {}) => {
    Post.find({}, (err, posts) => {
        if (err)
            callback(err);
        else
            callback(null, posts);
    });
};

module.exports.getPostCount = (callback: (err: any, count?: number) => {}) => {
    Post.count({}, (err, count) => {
        if (err)
            callback(err);
        else
            callback(null, count);
    });
};

module.exports.createPost = (postData: any, callback: (err: any, post?: IPostModel) => {}) => {
    Post.create(postData, (err, post) => {
        if (err)
            callback(err);
        else
            callback(null, post);
    });
};

module.exports.updatePost = (id: string, postData: any, callback: (err: any, post?: IPostModel) => {}) => {
    Post.findByIdAndUpdate(id, postData, {new: true}, (err, post) => {
        if (err)
            callback(err);
        else
            callback(null, post);
    });
};

module.exports.deletePost = (id: string, callback: (err: any, resp?: any) => {}) => {
    Post.findOneAndDelete({_id: id}, (err, resp) => {
        if (err)
            callback(err);
        else
            callback(null, resp);
    });
};

module.exports.findPostsByAuthor = (author: string, callback: (err: any, posts?: IPostModel[]) => {}) => {
    Post.find({author: author}, (err: any, posts: IPostModel[]) => {
        if (err)
            callback(err);
        else
            callback(null, posts);
    });
};

module.exports.findPostsByTags = (tags: string[], callback: (err: any, posts?: IPostModel[]) => {}) => {
    Post.find({tags: { $all: tags } }, (err: any, posts: IPostModel[]) => {
        if (err)
            callback(err);
        else
            callback(null, posts);
    });
};

/**
 * find all documents that contain ANY of the case-insensitive words in <searchText> in one or more of the following fields:
 *  - author
 *  - title
 *  - tags
 *
 * @param string searchText
 * @param (err: any, posts: IPostModel[])=>{} callback
 */
module.exports.searchPosts = (searchText: string, callback: (err: any, posts?: IPostModel[]) => {}) => {

    const tokens = searchText.split(' ');

    let tokenExpressions = tokens.map(token => {
        return { $regex: '.*' + token + '.*', $options: 'i' };
    });

    let conditions = {
        $or: [
            {
                $or: tokenExpressions.map(expr => {
                    return { author: expr };
                })
            },
            {
                $or: tokenExpressions.map(expr => {
                    return { title: expr };
                })
            },
            {
                $or: tokenExpressions.map(expr => {
                    return { tags: {$elemMatch: expr} };
                })
            },
        ]
    };

    Post.find(conditions, (err: any, posts: IPostModel[]) => {
        if (err)
            callback(err);
        else
            callback(null, posts);
    });
};
