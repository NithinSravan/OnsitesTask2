const clienId='48c3cbb5e39041b68aed3c064b9f33b4';
const clientSecret='8d099d93bce744be97f0f09eafc1f0f8';


let  artistOne;
let artistTwo;
const artistId1=document.getElementById("artist-id1")
const artistId2=document.getElementById("artist-id2")
class Node{
  constructor(data){
      this.data=data;
      this.parent=null;
      this.children=[];
  }
}

class Tree{
  constructor(data){
      let node=new Node(data);
      this._root=node;
  }
}

class Queue{
  constructor(){
    this.arr=[]
  }
  enqueue(data){
    this.arr.push(data);
  }
  dequeue(){
    return this.arr.shift();
  }
}


const getToken=async ()=>{
  const result=await fetch("https://accounts.spotify.com/api/token",{
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization':'Basic '+btoa(clienId+":"+clientSecret)
    },
    body: 'grant_type=client_credentials'
  })
  const data=await result.json();
  return data.access_token;
}

const getInput=async()=>{

  const token=await getToken()
  
  const resultOne=await fetch(`https://api.spotify.com/v1/search?q=${artistId1.value}&type=artist`,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  const resultTwo=await fetch(`https://api.spotify.com/v1/search?q=${artistId2.value}&type=artist`,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  const dataOne=await resultOne.json();
  const dataTwo=await resultTwo.json();
  artistOne=dataOne.artists.items[0].id;
  artistTwo=dataTwo.artists.items[0].id;

  buildTree();
}

const getRelArtists=async (id)=>{
  const token=await getToken()
  const result=await fetch("https://api.spotify.com/v1/artists/"+id+"/related-artists",{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  console.log(id)
  const data=await result.json();
  return data.artists;
}

const dispArtists=async(id)=>{

  const token=await getToken()
  const result=await fetch("https://api.spotify.com/v1/artists/"+id,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })

  const data=await result.json();
  return data.name;

}

const buildTree=async()=>{
  const tree=new Tree(artistOne)
  let artists;
  let queue=new Queue();

  queue.enqueue(tree._root);
  let curr=queue.dequeue();

  while(curr.data!==artistTwo){
    artists=await getRelArtists(curr.data);  
    let parent=curr;
    let child;

    for (let i = 0; i < artists.length; i++) {
      child = new Node(artists[i].id);
      parent.children.push(child);
      child.parent = parent;
      queue.enqueue(child);
    }
    curr=queue.dequeue();
  }
  let artist=[];
  let j=0;
  while(curr.parent!==null){
    artist.push(await dispArtists(curr.parent.data))
    const Div=document.createElement('div');
    document.querySelector('main').appendChild(Div);
    Div.classList.add("list")  
 
    if(artist[j].toLowerCase()===artistId1.value.toLowerCase()){
      Div.innerText="";
    }
    else{
      Div.innerText=artist;
    }
    curr=curr.parent;
    j++;
  }

  if(j===1){
    const Div=document.createElement('div');
    document.querySelector('main').appendChild(Div);
    Div.classList.add("list")  
    Div.innerText="Directly Related!";
  }
}


