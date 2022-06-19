import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import {Server} from "socket.io"
import path from "path"
dotenv.config();
const app = express()
const port=process.env.PORT || 8000;
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("connected")
})
//user schema
const userschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pic: { type: String, required: true, default: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png' },
},
  { timestamps: true }
);

//bcrypt the password
userschema.pre('save', async function (next) {
  if (!this.isModified) {
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})
const User = mongoose.model('User', userschema);




//chat schema

const chatschema = new mongoose.Schema({
  chatName: { type: String, trim: true },
  isgroupchat: { type: Boolean, default: false },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ],
  latestmsg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  grpadmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

}, {
  timestamps: true
}
)
const Chat = mongoose.model('Chat', chatschema)


//message schema

const msgschema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }
}, {
  timestamps: true
})
const Message = mongoose.model('Message', msgschema);

//Route for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email });
  if (user) {
    console.log(password)
    console.log(user.password)
    const valid = await bcrypt.compare(password, user.password)
    if (valid) {
      res.send({ message: "Login succsesfull", user: user })
    } else {
      res.send({ message: "password do not match" })
    }
  } else {
    res.send({ message: "User not registered" })
  }

})

//route for registration
app.post('/register', (req, res) => {
  console.log(req.body.data1)
  const pic = req.body.data1.image
  console.log(pic)
  const { name, email, password } = req.body.data1.user
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "Already registered", user: user })
    }
    else {
      const user = new User({
        name: name,
        email: email,
        password: password,
        pic: pic,
      })
      user.save(err => {
        if (err) {
          res.send(err)
        } else {
          res.send({ message: "Sucsessful register", user: user })
        }
      })
    }
  })
})
app.get("/search/:key/:key1", async (req, res) => {
  let data = req.params.key ? {
    "$or": [
      {
        "name": { $regex: req.params.key, $options: 'i' }
      }
    ],
  } : {};
  const data1 = await User.find(data).find({ _id: { $ne: req.params.key1 } }).select("-password");
  console.log(data1)
  res.send(data1)
})



//access chat
app.post("/accesschat", async (req, res) => {

  const  loginid = req.body.loginid
  const newuserid=req.body.newuserid
  var ischat = await Chat.find({
    isgroupchat: false,
    $and: [
      { users: { $elemMatch: { $eq: loginid } } },
      { users: { $elemMatch: { $eq: newuserid } } }
    ]
  }).populate("users", "-password").populate("latestmsg");
  ischat = await User.populate(ischat, {
    path: "latestmsg.sender",
    select: "name email pic"
  });
  if (ischat.length > 0) {
    res.send(ischat[0])
  } else {
    var chatData = {
      chatName: "Sender",
      isgroupchat: "false",
      users: [loginid, newuserid],
    };
    try {
      const createdchat = await Chat.create(chatData)
      const fullchat = await Chat.findOne({ _id: createdchat._id }).populate(
        "users",
        "-password"
      );
      res.send(fullchat)
    } catch (error) {
      throw new Error(error.message);
    }
  }

})

//Fetch chat

app.get('/fetchchat/:id', async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.params.id } } })
      .populate("users", "-password")
      .populate("grpadmin", "-password")
      .populate("latestmsg")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestmsg.sender",
          select: "name email pic"
        });
        res.send(result);
      })
  } catch (error) {
    throw new Error(error.message);
  }
})


//gropchat api

app.post("/groupchat", async (req, res) => {
  var { loginid, name } = req.body
  var users = JSON.parse(req.body.users)
  if (users.length < 2) {
    return res.send("More than 2 users are required");
  }
  users.push(loginid)
  try {
    const grpchat = await Chat.create({
      chatName: name,
      users: users,
      isgroupchat: true,
      grpadmin: loginid
    })
    const fullgrpchat = await Chat.findOne({ _id: grpchat._id }).populate(
      "users",
      "-password"
    ).populate("grpadmin", "-password");
    res.send(fullgrpchat)
  } catch (error) {
    throw new Error(error.message);
  }
})


//Rename grpchat api
app.post("/renamegrp", async (req, res) => {
  const { name, chatid } = req.body
  const updateChat = await Chat.findByIdAndUpdate(
    chatid,
    {
      chatName: name
    },
    {
      new: true
    }
  )
.populate("users","-password").populate("grpadmin","-password")
if(!updateChat)
{
  throw new Error("Chat not found");
}else
{
res.send(updateChat)
}
})


///Add new user
app.post("/addnew",async(req,res)=>{
  const{chatid,userid}=req.body
  const addnewuser=await Chat.findByIdAndUpdate(
    chatid,
    {
      $push:{users:userid},
    },
    {new:true}
  ).populate("users","-password").populate("grpadmin","-password")
  if(!addnewuser)
{
  throw new Error("user not found");
}else
{
res.send(addnewuser)
}
})

//remove user

app.post("/remove",async(req,res)=>{
  const{chatid,userid}=req.body
  const remove=await Chat.findByIdAndUpdate(
    chatid,
    {
      $pull:{users:userid},
    },
    {new:true}
  ).populate("users","-password").populate("grpadmin","-password")
  if(!remove)
{
  throw new Error("user not found");
}else
{
res.send(remove)
}
})

//send message route

app.post("/sendmsg",async(req,res)=>{
const{content,chatid,loginid}=req.body
if(!content||!chatid){
  console.log("Invalid data send");
  return res.send(400);
}
var newmsg=({
  sender:loginid,
  content:content,
  chat:chatid
})
try{
var message=await Message.create(newmsg);
message=await message.populate("sender","name pic")
message=await message.populate("chat")
message=await User.populate(message,{
  path:"chat.users",
  select:"name pic email"
})
await Chat.findByIdAndUpdate(chatid,{
  latestmsg:message,
})
res.send(message)
}catch(error)
{

}
})

//fetch all msg

app.get('/fetchallmsg/:key',async(req,res)=>{
  const msg=await Message.find({chat:req.params.key})
  .populate("sender","name pic email")
  .populate("chat");
  res.send(msg)
})

const __dirname=path.resolve();
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"/mychat/build")))
  app.get('*',(req,res)=>{
      res.sendFile(path.join(__dirname,"mychat","build","index.html"))
  })
}else{
  app.get("/",(req,res)=>{
      res.send("Api running");
  })
}

const server=app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const io=new Server(server,{
  pingTimeout:60000
})
io.on("connection",(socket)=>{
  console.log("connected to socket.io")
  socket.on('setup',(userdata)=>{
    socket.join(userdata.uid)
    socket.emit("connected");
  })

socket.on('join chat',(room)=>{
socket.join(room)
console.log("user joind room" +room)
})

socket.on('typing',(room)=>socket.in(room).emit("typing"))
socket.on('stoptyping',(room)=>socket.in(room).emit("stoptyping"))


socket.on('newmsg',(newmsgrcv)=>{
  var chat=newmsgrcv.chat;
  if(!chat.users) return console.log("chat.users not defined")

  chat.users.forEach(user=>{
    if(user._id==newmsgrcv.sender._id)return;
    socket.in(user._id).emit("msgreceived",newmsgrcv)
  })

})

socket.off('setup',()=>{
  console.log("user disconected")
  socket.leave(userdata.uid)
})

})
