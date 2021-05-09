import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../reducers';
import { SensorsProps } from '../../GridView';
import './AquariumSection.scss';

const AquariumSection : React.FC<SensorsProps> = ({waterTemp}) => {

  return (
    <div className="aquarium-section-component">
      <div className="water-temperature">
        <div className="text-value">
          <span>{waterTemp}°C</span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: ApplicationState) => {
  const { sensors: { waterTemp } } = state;

  return {
    waterTemp
  }
};

export default connect(
  mapStateToProps,
  {}
)(AquariumSection)

