const qrWizardSteps = [
  {
    title: 'Authenticator App Setup',
    title2:
      'You can go through the steps to configure two-factor authentication',
    description: (
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>
          Install{' '}
          <span style={{ fontWeight: 'bolder' }}>Microsoft Authenticator</span>{' '}
          from App Store.
        </li>
        <li>Click the add "+" button on top right of app.</li>
        <li>Choose use other account option. </li>
        <li>Camera screen for scaning QR will open.</li>
      </ul>
    ),
  },
  {
    title: 'Configuring using Authenticator',
    title2:
      'You can go through the steps to configure two-factor authentication',
    description: (
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>Scan the QR on the configure QR page of Duett.</li>
        <li>OR use the secret key from configure QR page of Duett. </li>
        <li>This will automatically add account in your app.</li>
      </ul>
    ),
  },
  {
    title: 'Verifying code',
    title2:
      'You can go through the steps to configure two-factor authentication',
    description: (
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>Click the added account on authenticator app.</li>
        <li>You will be able to see a 6 digit code.</li>
        <li>Enter the code to the configure QR page of Duett.</li>
        <li>
          You will be redirected to the dashboard after successful verification.
        </li>
      </ul>
    ),
  },
];

export default qrWizardSteps;
