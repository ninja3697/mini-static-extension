export const sidePane = () => {
    return (
        <div>
            {`<style>
  .shadows {
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.08),
      0px 4px 6px rgba(50, 50, 93, 0.11);
  }
  .background {
    background-color: white;
  }
  .borders {
    border-width: 0px;
    border-radius: 4px;
  }
  .layout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .size {
    width: 30px;
    height: 28px;
  }
  .content_1_0 {
    content: url("data:image/svg+xml;charset=utf8,%3Csvg%20viewBox%3D'475.0440%20193.7580%209.4290%202.5710'%20x%3D'0'%20y%3D'0'%20fill%3D'none'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D'Icons%2F12px%2FEllipsis%20H%2FPrimary'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20id%3D'Icons%2F12px%2FEllipsis%20H%2FPrimary_2'%20d%3D'M477.615%20194.401C477.615%20194.046%20477.327%20193.758%20476.973%20193.758H475.687C475.332%20193.758%20475.044%20194.046%20475.044%20194.401V195.686C475.044%20196.041%20475.332%20196.329%20475.687%20196.329H476.973C477.327%20196.329%20477.615%20196.041%20477.615%20195.686V194.401ZM481.044%20194.401C481.044%20194.046%20480.756%20193.758%20480.401%20193.758H479.115C478.76%20193.758%20478.473%20194.046%20478.473%20194.401V195.686C478.473%20196.041%20478.76%20196.329%20479.115%20196.329H480.401C480.756%20196.329%20481.044%20196.041%20481.044%20195.686V194.401ZM484.473%20194.401C484.473%20194.046%20484.185%20193.758%20483.83%20193.758H482.544C482.189%20193.758%20481.901%20194.046%20481.901%20194.401V195.686C481.901%20196.041%20482.189%20196.329%20482.544%20196.329H483.83C484.185%20196.329%20484.473%20196.041%20484.473%20195.686V194.401Z'%20fill%3D'%235E72E4'%2F%3E%3C%2Fg%3E%20%20%20%20%3C%2Fsvg%3E");
    width: 9.429px;
    height: 2.571px;
  }
</style>

<button class="shadows background borders layout size">
  <img class="content_1_0" />
</button>`}
</div>
    );
};


window.addEventListener('DOMContentLoaded', function () {
  const root = document.createElement('div');
  document.body.appendChild(root);

  render (
    <sidePane />,
  );
});