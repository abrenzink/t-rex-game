class Score{
    constructor(){
        this.points = 0;
    }

    // increase score as the game continues
    countPoints(){
        this.points = this.points + Math.round(getFrameRate() / 60);
    }

    setScore(value){
        this.points = value;
    }
}
export default Score;