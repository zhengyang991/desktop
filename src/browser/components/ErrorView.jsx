// Copyright (c) 2015-2016 Yuya Ochiai
// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ErrorCode: https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h

import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import {shell, remote} from 'electron';

export default function ErrorView(props) {
  const classNames = ['container', 'ErrorView'];
  if (!props.active) {
    classNames.push('ErrorView-hidden');
  }
  function handleClick(event) {
    event.preventDefault();
    shell.openExternal(props.errorInfo.validatedURL);
  }
  return (
    <Grid
      id={props.id}
      bsClass={classNames.join(' ')}
    >
      <div className='ErrorView-table'>
        <div className='ErrorView-cell'>
          <Row>
            <Col
              xs={0}
              sm={1}
              md={1}
              lg={2}
            />
            <Col
              xs={12}
              sm={10}
              md={10}
              lg={8}
            >
              <h2>{`无法连接到 ${remote.app.name}`}</h2>
              <hr/>
              <p>{`我们无法连接到 ${remote.app.name}. 如果刷新此页（Ctrl+R或Command+R）不起作用，请验证:`}</p>
              <br/>
              <ul className='ErrorView-bullets' >
                <li>{'您的计算机已连接到internet。'}</li>
                <li>{`${remote.app.name} 地址 `}
                  <a
                    onClick={handleClick}
                    href={props.errorInfo.validatedURL}
                  >
                    {props.errorInfo.validatedURL}
                  </a>{' 是正确的。'}</li>
                <li>{'你可以通过浏览器访问'}
                  <a
                    onClick={handleClick}
                    href={props.errorInfo.validatedURL}
                  >
                    {props.errorInfo.validatedURL}
                  </a></li>
              </ul>
              <br/>
              <div className='ErrorView-techInfo'>
                {props.errorInfo.errorDescription}{' ('}
                {props.errorInfo.errorCode }{')'}</div>
            </Col>
            <Col
              xs={0}
              sm={1}
              md={1}
              lg={2}
            />
          </Row>
        </div>
      </div>
    </Grid>
  );
}

ErrorView.propTypes = {
  errorInfo: PropTypes.object,
  id: PropTypes.string,
  active: PropTypes.bool,
};
