import React, { PropTypes } from 'react';
import MiniCard from './miniCard';

const styles = {
    display: 'inline-block',
    transform: 'rotate(-7deg)',
    WebkitTransform: 'rotate(-7deg)',
};

const propTypes = {
    card: PropTypes.object,
};

const CardDragPreview = (props) => {
    styles.width = `${props.card.clientWidth || 297}px`;
    styles.height = `${props.card.clientHeight || 88}px`;

    return (
        <div style={styles}>
            <MiniCard item={props.card.item} />
        </div>
    );
};

CardDragPreview.propTypes = propTypes;
export default CardDragPreview;
