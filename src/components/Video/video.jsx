import React, { Component } from "react";
import Axios from "axios";
import "./video.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

let urlApi = "http://localhost:3001/";
export class Video extends Component {
  state = {
    data: [],
    related: [],
    nextData: [],
    prevData: [],
    refresh: false,
    loading: true
  };
  componentDidMount() {
    this.getData();
    this.addView();
  }
  componentDidUpdate() {
    if (this.state.refresh) {
      this.getData();
      this.addView();
    }
  }
  addView = () => {
    Axios.put(urlApi + "view", { id: this.props.match.params.id }).then(
      this.setState({ refresh: false, loading: false })
    );
  };
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
    let render = this.state.related.map((val, idx) => {
      if (idx < 8) {
        return (
          <Link
            onClick={() => {
              this.setState({ refresh: true, loading: true });
            }}
            to={`/${val.author}/${val.title}/${val.id}`}
            className="linkaja related-preview"
          >
            <div
              style={{
                background: `url(${val.thumbnail})`
              }}
              className="related-preview-thumbnail"
            >
              <div className="preview-episode">Eps #{val.episode}</div>
            </div>
            <div className="ml-2">
              <p className="text-capitalize preview-title">
                {val.title} Episode {val.episode}
              </p>
              <p className="preview-author">{val.author}</p>
              <br />
              <p className="preview-views ml-1">{val.views} views</p>
            </div>
          </Link>
        );
      } else {
        return null;
      }
    });
    return render;
  };

  nextEps = () => {
    if (this.state.nextData) {
      return (
        <React.Fragment>
          <h6>Next Episode</h6>
          <Link
            onClick={() => {
              this.setState({ refresh: true, loading: true });
            }}
            to={`./${this.state.nextData.id}`}
            className="text-capitalize"
          >
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
          <Link
            onClick={() => {
              this.setState({ refresh: true, loading: true });
            }}
            to={`./${this.state.prevData.id}`}
            className="text-capitalize"
          >
            {this.state.prevData.title} Episode #{this.state.prevData.episode}{" "}
          </Link>
        </React.Fragment>
      );
    }
  };
  render() {
    if (this.state.loading) {
      return (
        <div className="gray-background">
          <div className="video-loading">
            <div className="video-loading-icon"></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="gray-background">
          <div className="video-container">
            <div className="video-main">
              <iframe
                title={this.state.data.title}
                width="640"
                height="480"
                src={this.state.data.video}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div>
              <div className="video-episodes">
                <div>{this.prevEps()}</div>
                <div className="text-right">{this.nextEps()}</div>
              </div>
            </div>
            <div className="video-text">
              <h1 className="video-title">
                {this.state.data.title} Episode #{this.state.data.episode}
              </h1>
              <Link
                to={`/${this.state.data.author}`}
                className="video-author text-left"
              >
                @{this.state.data.author}
              </Link>
              <h6>{this.state.data.views + 1} views</h6>
              <p className="video-desc">{this.state.data.description}</p>
            </div>
            <div className="video-related">
              <h4>Related Videos</h4>
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
