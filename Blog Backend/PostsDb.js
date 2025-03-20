const mongoose = require('mongoose');

const postDb = new mongoose.Schema({
    PostId:{
      type:String,
      required:true,
      unique:true
    },
    Status: {
        type: String,
        enum: ['active', 'inactive', 'draft','scheduled'], // Sirf ye 3 values allow hongi
        required: true // Status ko required bana rahe hain
    },
    MetaData: {
        Title: String,
        Meta_Description: String,
        Meta_Keywords: [String],
        Slug: { type: String, unique: true }, // SEO ke liye unique slug rakhna
        Canonical_Url: String,
        Author: String,
        Category: String,
        OG_Title: String,
        OG_Description: String
    },
    PostContent: {
        type: String,
        required: true
    },
    PostedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminData' }
    },
    EditedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminData', default: null }
    },
    PostedTime: {
        type: Date,
        default:null,
        set: v => v ? v : Date.now()
    },
    EditedTime: {
        type: Date,
        default: null,
        set: v => v ? v : Date.now()
    }
}, { collection: 'PostData' });

// `_id` pe default indexing hoti hai
// Slug pe manual indexing for SEO lookup

postDb.index({"Status":1});


module.exports = mongoose.model('PostData', postDb);
