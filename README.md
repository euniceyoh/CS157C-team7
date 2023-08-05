# Concert Mate 

Concert Mate is a web app designed to find people to enjoy concerts together with. Users will be able to easily connect with other concertgoers, meet people who have complimenting music interests, store a memento of their concert history, and create a network with whom they’ve shared their concert experiences with. 


### Problem & Solution  
We wanted to provide a platform for people who enjoy attending concerts and have difficulty finding people with similar music tastes to go together with. We wanted to provide people the opportunity to expand their network, meet others and learn about their musical interests, and ultimately decide if they would like to become concert buddies. 

## Features
### Login
- User can create new account & login with existing account.
- User can personalize account with music preference, favorite artists, past & future concerts they have or will attend. 

### Search 
- User can search for concerts. Logged in users have option to specify artist name & location. 
- User can view detailed concert page, including list of attendees. Users can filter list of attendees shown. 


### Profiles 
- User can view other user profiles. 
- User can create an artist profile. 
- User can create a new concert group.
- User can favorite an artist, and signify they will attend a concert.  


## Tech Stack
- Neo4j (+ Cypher Query Language) 
- Javascript 
- Express.js 
- HTML 
- Plain CSS + Tailwind CSS 

## Installation
1. Clone the repo: `git clone https://github.com/euniceyoh/CS157C-team7.git`
2. Move into your newly created directory and run `npm i`
3. Create an .env file in root directory & set the following variables: 
    * `DB_URI`
    * `DB_USER`
    * `DB_PASSWORD`
4. Run `npm start.` Port 3000 must be available.
5. The web app is now running on http://localhost:3000/.

## Demo 

```python

```

## Roadmap 
### Ideas for Future Releases 
- Built-in messaging platform.
- Save for each concert, who you attended them with.
- Notify friends on the platform which concerts you're interested in. 


## Authors
- Sina Kalantar
- Can Huynh
- Eunice Oh

## License

[MIT](https://choosealicense.com/licenses/mit/)