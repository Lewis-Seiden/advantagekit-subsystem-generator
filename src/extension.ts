// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let generate = vscode.commands.registerCommand('highlanders-advantagekit-subsystem-generator.generateSubsystem', () => {
		let name = "default";
		console.log("Waiting for name");
		let namePromise = vscode.window.showInputBox().then((result) => {
			name = result??"";
			console.log("Got name " + name);
			if (name === "") {
				console.error('should enter a name');
				return;
			}
			if (vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders.length !== 1) {
				console.error('workspace should have one folder as root');
				return;
			}
			// Find the project
			let root = vscode.workspace.workspaceFolders[0].uri.fsPath;
			// If this is an frc project, put it in the right place
			if (fs.existsSync(root + "\\src\\main\\java\\frc\\robot\\subsystems")) {
				root = root.concat("\\src\\main\\java\\frc\\robot\\subsystems");
			}
			console.log(root);
			// Make the folder and files!
			if (!fs.existsSync(root + "\\" + name)) {
				fs.mkdirSync(root + "\\" + name);
			}
			fs.writeFileSync(root + "\\" + name + "\\" + name + "Subsystem.java", 
`package frc.robot.subsystenms.` + name + `;\n
import org.littletonrobotics.junction.Logger;\n
import edu.wpi.first.wpilibj2.command.SubsystemBase;\n
public class ` + name + `Subsystem extends SubsystemBase {
	` + name + `IO io;
	` + name + `IOInputsAutoLogged inputs;\n
	public ` + name + `Subsystem(` + name + `IO io) {
		this.io = io;
	}\n
	@Override
	public void periodic() {
		io.updateInputs(inputs);
		Logger.getInstance().processInputs(` + name + `, inputs);
	}
}\n`
			);
			// Didnt realize you could do multiline strings like this at first so its a little jank
			fs.writeFileSync(root + "\\" + name + "\\" + name + "IO.java", 
`package frc.robot.subsystenms.` + name + `;\n
import org.littletonrobotics.junction.AutoLog; \n
public interface ` + name + `IO {
	@AutoLog
	public static class ` + name + `IOInputs {}\n
	public abstract void updateInputs(` + name + `IOInputs inputs);
}`);
			fs.writeFileSync(root + "\\" + name + "\\" + name + "IOSim.java", 
`package frc.robot.subsystenms.` + name + `;\n
public class ` + name + `IOSim implements ` + name + `IO {
	public ` + name + `IOSim() {}

	@Override
	public void updateInputs(` + name + `IO io) {}
}
`);
		});
	});

	context.subscriptions.push(generate);
}

// This method is called when your extension is deactivated
export function deactivate() {}
