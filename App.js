import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Thumbnail, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dogs: []
    }
  }

  // Retrieve the list of dogs from Airtable
  getDogs() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appVgv2Xwhor2ELI1/dogs?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keymsRJr84XPtoT4e'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        dogs: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getDogs(); // refresh the list when we're done
  }

  // Upvote an idea
  upvoteDog(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appVgv2Xwhor2ELI1/dogs/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keymsRJr84XPtoT4e', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getDogs(); // refresh the list when we're done
    });
  }

  // Downvote an idea
  downvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appVgv2Xwhor2ELI1/dogs/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keymsRJr84XPtoT4e', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getDogs(); // refresh the list when we're done
    });
  }

  // Ignore an idea
  ignoreIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newDogsData = this.state.dogs.slice();
    newDogsData.splice(rowId, 1);

    // Set state
    this.setState({
      dogs: newDogsData
    });
  }

  // Delete an idea
  deleteDog(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newDogsData = this.state.dogs.slice();
    newDogsData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appVgv2Xwhor2ELI1/dogs/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keymsRJr84XPtoT4e', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getDogs(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Thumbnail square source={{uri: data.fields.photo}} />
        </Body>
        <Body>
          <Text>{data.fields.name}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.votes} </Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteDog(data, secId, rowId, rowMap)}>
        <Icon active name="happy" style={{fontSize: 45}}/>
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.deleteDog(data, secId, rowId, rowMap)}>
        <Icon active name="close" style={{fontSize: 45}}/>
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.dogs);
    return (
      <Container>
        <Header>
          <Body>
            <Title>PupPics</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
