import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../../components/Icon';
import PopulateUtil from '../../../../../util/populate';
import ImageViewer from '../../../../features/ImageViewer';


class File extends PureComponent {
	static propTypes = {
	    content: PropTypes.string,
	}
	constructor(props) {
	    super(props);
	    this.state = {
	        showImgViewer: false,
	    };
	}
	handleImageDoubleClick = (url) => {
	    this.setState({
	        showImgViewer: true,
	        image: url,
	    });
	}
	closeImageViewer = () => {
	    this.setState({
	        showImgViewer: false,
	    });
	}
	renderImg = url => (
		<div className="user-img">
			<img
				src={url}
				height="100"
				data-src={url}
				ref={i => this.img = i}
				onDoubleClick={() => this.handleImageDoubleClick(url)}
			/>
			{
				this.state.showImgViewer ?
					<ImageViewer
						image={this.state.image}
						closeImage={this.closeImageViewer}
					/>
					:
					null
			}
		</div>
	)
	renderFiles = (result) => {
		if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(result.type)) {
			return this.renderImg(result.url);
		}
		return (
			<div className="file">
				<div className="file-icon">
					<Icon icon="icon-wenjian" size={30} iconColor="#ffca28" />
				</div>
				<div>
					<p>{result.name}</p>
					<p className="file-size">{result.size}</p>
				</div>
				<a href={result.url} download>
					下载
				</a>
			</div>
		);
	}
    render() {
        const { content } = this.props;
        const result = PopulateUtil.file(content) || {};
	    if (!result) {
	        return null;
	    }
        return this.renderFiles(result);
    }
}

export default File;
