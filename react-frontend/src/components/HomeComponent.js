import React, {useState} from 'react'
import { Provider } from 'react-redux'
import '../App.css'
import store from '../redux/store'
import { Grid, Accordion, Header, Icon, Button, Divider} from "semantic-ui-react"
import AliceCarousel from 'react-alice-carousel';
import {Link} from 'react-router-dom'
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../images/banner-bg1.jpg' 
import image2 from '../images/banner-bg2.jpg' 
import image3 from '../images/banner-bg3.jpg'
function HomeComponent () {
  
  var w = window.innerWidth;
  return (
    <div>
      { w > 700 ?
      <div>
        <AliceCarousel autoPlay autoWidth autoHeight='true' infinite animationType="fadeout" disableDotsControls disableButtonsControls autoPlayInterval='5000'>
            <img src={image1} className='sliderimg'/>
            <img src={image2} className='sliderimg'/>
            <img src={image3} className='sliderimg'/>
        </AliceCarousel>

        
        
        <Grid centered textAlign='center' columns='equal' relaxed>
        <Grid.Row>
        <Grid.Column width={2}></Grid.Column>
        <Grid.Column className='lightGrayBackground' centered textAlign='center' >
          <Divider hidden />
          <Link to="/charts"><Icon name="chart line" color="green" size="huge"></Icon></Link>
          <Header as='h2' inverted>
            <Header.Content>Analyze a Stock</Header.Content>
            <br/><br/>
            <Header.Subheader>Compare a stock price with technical indicators</Header.Subheader>
          </Header>
          
          <br/>
          <Link to="/charts"><Button color='green' content='Go to Charts'/></Link>
          <br/>
          <Divider hidden />


        </Grid.Column>
        <Grid.Column width={1}></Grid.Column>
        
        <Grid.Column className='lightGrayBackground' centered textAlign='center' >
          <Divider hidden />
          <Link to="/posts"><Icon name="comment outline" color="green" size="huge"></Icon></Link>
          {/* <Button size='massive' inverted color='green'>
            <Button.Content><Icon name="chart line" color="green"></Icon></Button.Content>
          </Button> */}
          <Header as='h2' inverted>
            <Header.Content>Connect with Traders</Header.Content>
            <br/><br/>
            <Header.Subheader>Join the conversation on what other trading are seeing</Header.Subheader>  
          </Header>
          
          <br/>
          <Link to="/posts"><Button color='green' content='Go to Posts'/></Link>
          <br/>
          <Divider hidden />
        </Grid.Column>
        <Grid.Column width={2}></Grid.Column>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={2}></Grid.Column>
        <Grid.Column className='lightGrayBackground'>
        <Header as='h2' inverted centered textAlign='center'>
          <br/>
            <Header.Content>About StonkTA</Header.Content>
        </Header>

        <Header as='h2' inverted>
            {/* he mission of StonkTA is to create an online community where traders can easily research equites, and start a dialogue BEFORE making a trade.
            Let's face it. Stock trading is hard. StonkTA has the Technical Analysis tools needed to time a trade and the tools to re-consider with the feedback of other traders. */}
            <Header.Subheader>This site was
            developed out of frustration over the inability to easily share charts on other social platforms. People are visual creatures and the ability to see a chart, along
            with solid due diligence, is a nicer way to read financial analysis! StonkTA was created by Jacob Anderson, an aspiring
            US-TX based developer open to full-time or contract work. Please reach out if you have ideas on projects or ways to improve StonkTA. Thanks!  
            </Header.Subheader>
          </Header>
          <br/>
        </Grid.Column>
        <Grid.Column width={2}></Grid.Column>
        </Grid.Row>
        </Grid>
        <br/>
        <br/>
        </div>
      :
      <div>
      <img src={image1} class="center-fit"/>
      <Grid>
        <Grid.Row className='lightGrayBackground' centered textAlign='center' >
          <br/>
          <Link to="/charts"><Icon name="chart line" color="green" size="huge"></Icon></Link>
          <br/>
          <Header as='h2' inverted>
            <Header.Content>Analyze a Stock</Header.Content>
            <br/><br/>
            <Header.Subheader>Compare a stock price with RSI, MACD, and other technical indicators to visualize bullish/bearish signals</Header.Subheader>
          </Header>
          
          <br/>
          <Link to="/charts"><Button color='green' content='Go to Charts'/></Link>

        </Grid.Row>
        <Grid.Row></Grid.Row>
        <Grid.Row className='lightGrayBackground' centered textAlign='center' >
          <br/>
          <Link to="/posts"><Icon name="comment outline" color="green" size="huge"></Icon></Link>
          <br/>
          <Header as='h2' inverted>
            <Header.Content>Connect with Traders</Header.Content>
            <br/><br/>
            <Header.Subheader>Join the conversation on what other trading are seeing</Header.Subheader>  
          </Header>
          
          <br/>
          <Link to="/posts"><Button color='green' content='Go to Posts'/></Link>
        </Grid.Row>
      </Grid>
    </div>
     }
    </div>
  )
}

export default HomeComponent