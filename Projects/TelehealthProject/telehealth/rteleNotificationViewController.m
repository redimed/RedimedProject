//
//  rteleNotificationViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleNotificationViewController.h"
#import "rteleDoctors.h"
#import "rteleAppDelegate.h"
#import "rteleCollectionCell.h"
#import "constants.h"
@interface rteleNotificationViewController () <UIActionSheetDelegate,UIAlertViewDelegate>{
    BOOL isAdd;
    NSString *currentId;
}

@end

@implementation rteleNotificationViewController
@synthesize entries;
@synthesize selectedIndex;
@synthesize CV;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    entries = [[[rteleDoctors alloc] init] loadData:@"99999"];
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
#pragma mark - UICollectionViewDataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    //NSLog(@"%d", [entries count]);
    return [entries count];
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    rteleCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"doctor" forIndexPath:indexPath];
    
    //Bird *bird = [birds objectAtIndex:(indexPath.section*2 + indexPath.row)];
    rteleDoctor *entry = [entries objectAtIndex:indexPath.row];
    cell.label.text = [entry.detail objectForKey:@"name"];
    
//    if ([[entry.detail objectForKey:@"default"] intValue] == 1){
//        NSLog(@"%@-%@",entry.username, entry.mid);
//        cell.imageView.image = [UIImage imageNamed:@"user_checked.png"];
//    }
//    else{
//        cell.imageView.image = [UIImage imageNamed:@"user"];
//    }
    

    if (entry.isPush == 1) {
        NSLog(@"ImageCLL");
        cell.imageView.image = [UIImage imageNamed:@"user_checked.png"];
    }else{
        if (entry.isPush == 0) { //Stop
            NSLog(@"NonCLL");
            cell.imageView.image = [UIImage imageNamed:@"user"];
        }else{ //Not exist
            NSLog(@"NonCLL");
            cell.imageView.image = [UIImage imageNamed:@"user_warning"];
        }
        
    }
    return cell;
}
-(void)collectionView:(UICollectionView*) collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    //iOS8Error
    rteleDoctor *entry = [entries objectAtIndex:indexPath.row];
    selectedIndex = indexPath;
    //NSLog(@"%@",entry.detail);
    if (entry.isPush == 0){
//        UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Add %@ to receiving SMS notfication list.",[entry.detail objectForKey:@"name"]]
//                                                           delegate:self
//                                                  cancelButtonTitle:@"Cancel"
//                                             destructiveButtonTitle:nil
//                                                  otherButtonTitles:@"Yes",@"No", nil];
//        sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
//        [sheet setTranslatesAutoresizingMaskIntoConstraints:NO];
//        [sheet showInView:self.view];
        
        [[[UIAlertView alloc] initWithTitle:[NSString stringWithFormat:@"Add %@ to receiving SMS notfication list.",[entry.detail objectForKey:@"name"]] message:nil delegate:self cancelButtonTitle:@"Yes" otherButtonTitles:@"No", nil] show];
        
    }else{
//        UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Remove %@ from receiving SMS notfication list.",[entry.detail objectForKey:@"name"]]
//                                                           delegate:self
//                                                  cancelButtonTitle:@"Cancel"
//                                             destructiveButtonTitle:nil
//                                                  otherButtonTitles:@"Yes",@"No", nil];
//        sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
//        [sheet setTranslatesAutoresizingMaskIntoConstraints:NO];
//        [sheet showInView:self.view];
        if (entry.isPush == 1) {
            [[[UIAlertView alloc] initWithTitle:[NSString stringWithFormat:@"Remove %@ from receiving SMS notfication list.",[entry.detail objectForKey:@"name"]] message:nil delegate:self cancelButtonTitle:@"Yes" otherButtonTitles:@"No", nil] show];
        }else{
            [[[UIAlertView alloc] initWithTitle:@"Warning" message:@"Can't enable/disable this user.\nBecause this user have yet used Notification app." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        }
        
    }
    
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    //NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    rteleDoctor *entry = [entries objectAtIndex:selectedIndex.row];
    currentId = entry.mid;
    //NSLog(@"%@",entry.detail);
    rteleDoctor *entryDoctor = [entries objectAtIndex:selectedIndex.row];
    
    if (entry.isPush == 0){
        switch (buttonIndex) {
            case 0: {//Add
                isAdd = TRUE;
                [entryDoctor setIsPush:1];
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/setDefault/%@/?token=%@", entry.mid,[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
                [self performSelector:@selector(sendRequest:) withObject:[url absoluteString] afterDelay:0.5];
                break;
            }
            case 1:
                isAdd = FALSE;
                [delegate hideActivityViewer];
                break;
            default:
                isAdd = FALSE;
                [delegate hideActivityViewer];
                break;
        }
    }else{
        if (entry.isPush == 1) {
            switch (buttonIndex) {
                case 0: { //remove
                    isAdd = FALSE;
                    [entryDoctor setIsPush:0];
                    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/removeDefault/%@/?token=%@", entry.mid,[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
                    [self performSelector:@selector(sendRequest:) withObject:[url absoluteString] afterDelay:0.5];
                    break;
                }
                case 1:
                    isAdd = FALSE;
                    [delegate hideActivityViewer];
                    break;
                default:
                    isAdd = FALSE;
                    [delegate hideActivityViewer];
                    break;
            }
        }
        
    }
    
    //replace
    [entries replaceObjectAtIndex:selectedIndex.row withObject:entryDoctor];
}

-(void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    //NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    rteleDoctor *entry = [entries objectAtIndex:selectedIndex.row];
    //NSLog(@"%@",entry.detail);
    if ([[entry.detail objectForKey:@"default"] intValue] == 0){
        switch (buttonIndex) {
            case 0: {
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/setDefault/%@/?token=%@", entry.mid,[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
                [self performSelector:@selector(sendRequest:) withObject:[url absoluteString] afterDelay:0.5];
                break;
            }
            case 1:
                [delegate hideActivityViewer];
                break;
            default:
                [delegate hideActivityViewer];
                break;
        }
    }else{
        switch (buttonIndex) {
            case 0: {
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/removeDefault/%@/?token=%@", entry.mid,[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
                [self performSelector:@selector(sendRequest:) withObject:[url absoluteString] afterDelay:0.5];
                break;
            }
            case 1:
                [delegate hideActivityViewer];
                break;
            default:
                [delegate hideActivityViewer];
                break;
        }
    }
}
-(void)sendRequest:(NSString*)url{
    NSMutableURLRequest *request =[NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    //NSLog(@"%@", url);
    NSURLResponse *response;
    NSError *err;
    NSData* responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&err];
    
    NSString *retval = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    if ([retval isEqualToString:@"1"]){
        rteleDoctor *entry = [entries objectAtIndex:selectedIndex.row];
        rteleCollectionCell *cell = (rteleCollectionCell *)[CV cellForItemAtIndexPath:selectedIndex];
        if (entry.isPush == 1) {
            NSLog(@"ImageCLL");
            cell.imageView.image = [UIImage imageNamed:@"user_checked.png"];
        }else{
            if (entry.isPush == 0) { //Stop
                NSLog(@"NonCLL");
                cell.imageView.image = [UIImage imageNamed:@"user"];
            }else{ //Not exist
                NSLog(@"NonCLL");
                cell.imageView.image = [UIImage imageNamed:@"user_warning"];
            }
            
        }
    } else {
        NSLog(@"%@", retval);
    }
    
    //
    responseData = nil;
    if (isAdd) {
        NSURL *urlRequest = [NSURL URLWithString:[NSString stringWithFormat:@"json/updatePushInHealthReview/1/%@",currentId] relativeToURL:[rteleWebserviceManager getURL]];
        
        NSURLRequest *newRequest = [NSURLRequest requestWithURL:urlRequest];
        responseData = [NSURLConnection sendSynchronousRequest:newRequest returningResponse:&response error:&err];
        retval = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
        NSLog(@"\nReturnValue: %@",retval);
        
    }else{
         NSURL *urlRequest = [NSURL URLWithString:[NSString stringWithFormat:@"json/updatePushInHealthReview/0/%@",currentId] relativeToURL:[rteleWebserviceManager getURL]];
        NSURLRequest *newRequest = [NSURLRequest requestWithURL:urlRequest];
        responseData = [NSURLConnection sendSynchronousRequest:newRequest returningResponse:&response error:&err];
        retval = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
        NSLog(@"\nReturnValue: %@",retval);
    }
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
}
@end
