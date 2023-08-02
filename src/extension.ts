// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('highlanders-advantagekit-subsystem-generator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Highlanders AdvantageKit Subsystem Generator!');
	});

	context.subscriptions.push(disposable);

	let generate = vscode.commands.registerCommand('highlanders-advantagekit-subsystem-generator.generateSubsystem', () => {
		let name = "Example";
		let hardwareType = "Falcon500";
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
		fs.writeFileSync(root + "\\" + name + "\\" + name + "IO" + hardwareType + ".java", 
`package frc.robot.subsystenms.` + name + `;\n
public class ` + name + `IO` + hardwareType + ` implements ` + name + `IO {
	public ` + name + `IO` + hardwareType + `() {}

	@Override
	public void updateInputs(` + name + `IO io) {}
}
		`);
	});

	context.subscriptions.push(generate);
}

// This method is called when your extension is deactivated
export function deactivate() {}
