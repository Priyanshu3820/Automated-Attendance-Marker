{ pkgs, ... }: {
  # Let Nix manage packages
  packages = [ pkgs.nodejs_20 ];

  # VSCode extensions
  idx = {
    extensions = [ "dbaeumer.vscode-eslint" ];

    # Workspace lifecycle hooks
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        dev-server = "npm run dev";
      };
    };

    # Web preview
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
