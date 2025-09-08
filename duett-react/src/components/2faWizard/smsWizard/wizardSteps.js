const wizardSteps = [
  {
    title: 'Enter Phone Number',
    title2:
      'You can go through the steps to configure two-factor authentication',
    description: (
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>Enter phone number without country code (+1).</li>
        <li>Phone number should be 10 digits.</li>
        <li>Click the 'Send OTP' button to send OTP to the number.</li>
        <li>
          For valid phone number you will be redirected to verify OTP screen.
        </li>
      </ul>
    ),
  },
  {
    title: 'Receiving OTP Code',
    title2:
try {
    'You can go through the steps to configure two-factor authentication';
} catch (error) {
    console.error(error);
}
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>Open your phone SMS app.</li>
        <li>Look for a 6-digit Duett OTP.</li>
        <li>
          You can resend the code after 5 minutes in case the OTP is not
          received.
        </li>
      </ul>
    ),
  },
  {
    title: 'Verify OTP',
    title2:
      'You can go through the steps to configure two-factor authentication',
    description: (
      <ul style={{ fontFamily: 'Arial', fontSize: '12px' }}>
        <li>Now on the verify screen, enter the OTP code.</li>
        <li>The code should be 6 characters long.</li>
        <li>
          After adding the code, you need to click the 'Verify OTP' button.
        </li>
        <li>
          You will be redirected to the dashboard after successful verification.
        </li>
      </ul>
    ),
  },
];

export default wizardSteps;
