import React from 'react'
import { Provider } from 'react-redux'
import '../App.css'
import store from '../redux/store'
import { Grid, Header, Icon, Button, Divider} from "semantic-ui-react"
import AliceCarousel from 'react-alice-carousel';
import {Link} from 'react-router-dom'
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../images/banner-bg1.jpg' 
import image2 from '../images/banner-bg2.jpg' 
import image3 from '../images/banner-bg3.jpg'
import ContactContainer from './ContactContainer'

function HomeComponent () {
  
  var w = window.innerWidth;
  return (
    <div>
      <Provider store={store}>
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
        <Grid.Column width={0.5}></Grid.Column>
        
        <Grid.Column className='lightGrayBackground' centered textAlign='center' >
          <Divider hidden />
          <Link to="/posts"><Icon name="comment outline" color="green" size="huge"></Icon></Link>
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

        <Header as='h1' inverted>
            {/*   This site was
            developed out of frustration over the inability to easily share charts on other social platforms. People are visual creatures and the ability to see a chart, along
            with solid due diligence, is a nicer way to read financial analysis!he mission of StonkTA is to create an online community where traders can easily research equites, and start a dialogue BEFORE making a trade.
            Let's face it. Stock trading is hard. StonkTA has the Technical Analysis tools needed to time a trade and the tools to re-consider with the feedback of other traders. */}
            <Header.Subheader>
            <p>Even if you're brand new to trading, you've seen a stock chart on CNBC with a simple moving average. Technical Analysis broadly refers to
            indicators calculated from stock price and volume, that elucidate trends not obvious from the price alone.  StonkTA offers a clean inferace
            with 26 top indicators and the ability to customize them based on your time horizon. 
            </p><br/>
            <p>This bull run during the COVID pademic demonstrates that even professional traders have biases that lead to losses, or at least, missed opportunites. 
            StonkTA's Posts allow you to share your thoughts on a chart and get feedback from the community, or just browse what other traders are thinking. 
            </p><br/>
            <p>
            StonkTA was created by Jacob Anderson, an aspiring US-TX based developer open to full-time or contract work. Please reach out if you have ideas 
            on projects or ways to improve StonkTA. Thanks!  
            </p></Header.Subheader>
          </Header>
          <br/>
          <Divider hidden/>
          <ContactContainer/>
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
        <Grid.Row>
        <Grid.Column className='lightGrayBackground'>
        <Header as='h2' inverted centered textAlign='center'>
          <br/>
            <Header.Content>About StonkTA</Header.Content>
        </Header>

        <Header as='h1' inverted>
            {/*   This site was
            developed out of frustration over the inability to easily share charts on other social platforms. People are visual creatures and the ability to see a chart, along
            with solid due diligence, is a nicer way to read financial analysis!he mission of StonkTA is to create an online community where traders can easily research equites, and start a dialogue BEFORE making a trade.
            Let's face it. Stock trading is hard. StonkTA has the Technical Analysis tools needed to time a trade and the tools to re-consider with the feedback of other traders. */}
            <Header.Subheader>
            <p>Even if you're brand new to trading, you've seen a stock chart on CNBC with a simple moving average. Technical Analysis broadly refers to
            indicators calculated from stock price and volume, that elucidate trends not obvious from the price alone.  StonkTA offers a clean inferace
            with 26 top indicators and the ability to customize them based on your time horizon. 
            </p><br/>
            <p>This bull run during the COVID pademic demonstrates that even professional traders have biases that lead to losses, or at least, missed opportunites. 
            StonkTA's Posts allow you to share your thoughts on a chart and get feedback from the community, or just browse what other traders are thinking. 
            </p><br/>
            <p>
            StonkTA was created by Jacob Anderson, an aspiring US-TX based developer open to full-time or contract work. Please reach out if you have ideas 
            on projects or ways to improve StonkTA. Thanks!  
            </p></Header.Subheader>
          </Header>
          <br/>
          <Divider hidden/>
          <ContactContainer/>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
     }
     </Provider>
    </div>
  )
}

export default HomeComponent