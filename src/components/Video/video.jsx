import React, { Component } from "react";
import Axios from "axios";
import "./video.css";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

let urlApi = "http://localhost:3001/";
export class Video extends Component {
  state = { data: [], related: [], nextData: [], prevData: [] };
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Axios.get(urlApi + "getvideo/" + this.props.match.params.id).then(res => {
      this.setState({ data: res.data[0] });
      // NEXT EPISODE
      Axios.get(urlApi + "getepisode", {
        params: {
          title: this.state.data.title,
          episode: parseInt(this.state.data.episode) + 1
        }
      }).then(res => {
        this.setState({ nextData: res.data[0] });
      });
      // PREVIOUS EPISODE
      Axios.get(urlApi + "getepisode", {
        params: {
          title: this.state.data.title,
          episode: parseInt(this.state.data.episode) - 1
        }
      }).then(res => {
        this.setState({ prevData: res.data[0] });
      });
      // RELATED VIDEOS
      Axios.get(urlApi + "getrelatedvideos", {
        params: { category: res.data[0].category }
      }).then(res => {
        let filter = res.data.filter(val => {
          return val.id !== this.state.data.id;
        });
        this.setState({ related: filter });
      });
    });
  };

  renderRelated = () => {
    let render = this.state.related.map(val => {
      return (
        <Link to={`./${val.id}`} className="linkaja preview">
          <div
            style={{
              background: `url(${val.thumbnail})`
            }}
            className="preview-thumbnail"
          >
            <div className="preview-episode">Eps #{val.episode}</div>
          </div>
          <p className="text-capitalize preview-title">{val.title}</p>
          <p className="preview-author text-left">@{val.author}</p>
        </Link>
      );
    });
    return render;
  };

  nextEps = () => {
    if (this.state.nextData) {
      return (
        <React.Fragment>
          <h6>Next Episode</h6>
          <Link to={`./${this.state.nextData.id}`}>
            {this.state.nextData.title} Episode #{this.state.nextData.episode}{" "}
          </Link>
        </React.Fragment>
      );
    }
  };
  prevEps = () => {
    if (this.state.prevData) {
      return (
        <React.Fragment>
          <h6>Previous Episode</h6>
          <Link to={`./${this.state.prevData.id}`}>
            {this.state.prevData.title} Episode #{this.state.prevData.episode}{" "}
          </Link>
        </React.Fragment>
      );
    }
  };
  render() {
    if (!this.props.username) {
      return <Redirect to="/"></Redirect>;
    } else {
      return (
        <div className="gray-background">
          <div className="video-container">
            <div className="video-main">
              <iframe
                className="my-5"
                title={this.state.data.title}
                width="560"
                height="315"
                src={this.state.data.video}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <hr />
              <h1 className="video-title">
                {this.state.data.title} Episode #{this.state.data.episode}
              </h1>
              <p className="author">@{this.state.data.author}</p>
              <p className="video-desc">{this.state.data.description}</p>
              <div className="video-episodes my-5">
                <div>{this.prevEps()}</div>
                <div className="text-right">{this.nextEps()}</div>
              </div>
            </div>
            <div className="line1"></div>
            <div className="video-related">
              <h1 className="judul">Related Videos</h1>
              <div className="video-list">{this.renderRelated()}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username
  };
};
export default connect(mapStateToProps)(Video);
